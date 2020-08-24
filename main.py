# -*- coding: utf-8 -*-
from github import Github
from github.Issue import Issue
import argparse

MD_HEAD = """## Gitblog
My personal blog using issues and GitHub Action

"""

ME_GITHUB_NAME = "yihong0618"
ANCHOR_NUMBER = 5
TOP_ISSUES_LABELS = [
    "Top",
]


def isMe(issue):
    return issue.user.login == ME_GITHUB_NAME


def format_time(time):
    return str(time)[:10]


def login(token):
    return Github(token)


def get_repo(user: Github, repo: str):
    return user.get_repo(repo)


def get_top_issues(repo):
    return repo.get_issues(labels=TOP_ISSUES_LABELS)


def get_repo_labels(repo):
    return [l for l in repo.get_labels()]


def get_issues_from_label(repo, label):
    return repo.get_issues(labels=(label,))


def add_issue_info(issue, md):
    time = format_time(issue.created_at)
    md.write(f"- [{issue.title}]({issue.html_url})--{time}\n")


def add_md_top(repo, md):
    if not TOP_ISSUES_LABELS:
        return
    top_issues = get_top_issues(repo)
    with open(md, "a+", encoding="utf-8") as md:
        md.write("## 置顶文章\n")
        for issue in top_issues:
            if isMe(issue):
                add_issue_info(issue, md)


def add_md_recent(repo, md):
    new_five_issues = repo.get_issues()[:5]
    with open(md, "a+", encoding="utf-8") as md:
        md.write("## 最近更新\n")
        for issue in new_five_issues:
            if isMe(issue):
                add_issue_info(issue, md)


def add_md_header(md):
    with open(md, "w", encoding="utf-8") as md:
        md.write(MD_HEAD)


def add_md_label(repo, md):
    labels = get_repo_labels(repo)
    with open(md, "a+", encoding="utf-8") as md:
        for label in labels:

            # we don't need add top label again
            if label.name in TOP_ISSUES_LABELS:
                continue

            issues = get_issues_from_label(repo, label)
            if issues.totalCount:
                md.write("## " + label.name + "\n")
                issues = sorted(issues, key=lambda x: x.created_at, reverse=True)
            i = 0
            for issue in issues:
                if not issue:
                    continue
                if isMe(issue):
                    if i == ANCHOR_NUMBER:
                        md.write("<details><summary>显示更多</summary>\n")
                        md.write("\n")
                    add_issue_info(issue, md)
                    i += 1
            if i > ANCHOR_NUMBER:
                md.write("</details>\n")
                md.write("\n")


def main(token):
    user = login(token)
    repo = get_repo(user, "yihong0618/gitblog")
    get_top_issues(repo)
    add_md_header("README.md")
    add_md_top(repo, "README.md")
    add_md_recent(repo, "README.md")
    add_md_label(repo, "README.md")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("github_token", help="github_token")
    options = parser.parse_args()
    main(options.github_token)
