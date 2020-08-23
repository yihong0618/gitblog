# -*- coding: utf-8 -*-
from github import Github
from github.Issue import Issue
import argparse

MD_HEAD = """## Gitblog
My personal blog using issues and GitHub Action

"""

ME_GITHUB_NAME = "yihong0618"
TOP_ISSUES_LIST = [178, 177, 102, 111]


def isMe(issue):
    return  issue.user.login == ME_GITHUB_NAME 


def format_time(time):
    return str(time)[:10]


def login(token):
    return Github(token)


def get_repo(user: Github, repo: str):
    return user.get_repo(repo)


def get_repo_issues(repo):
    return repo.get_issues()


# get the issues top from hard code issues list
def get_top_issues(repo):
    return [repo.get_issue(number=i) for i in TOP_ISSUES_LIST]


def get_repo_labels(repo):
    return [l for l in repo.get_labels()]


def get_issues_from_label(repo, label):
    return repo.get_issues(labels=(label,))


def get_comments_last_time(issue: Issue):
    comments = list(issue.get_comments())
    if not comments:
        return None
    return max(i.updated_at for i in comments)


def get_issue_info(issue: Issue):
    issue_url = issue.html_url
    issue_title = issue.title
    last_issue_time = issue.updated_at or issue.created_at
    last_comments_time = get_comments_last_time(issue)
    if last_comments_time:
        last_issue_time = max(last_issue_time, last_comments_time)
    print(issue_title, issue_url, last_issue_time, issue.get_labels()[0])


def add_issue_info(issue, md):
    time = format_time(issue.created_at)
    md.write(f"- [{issue.title}]({issue.html_url})--{time}\n")


def add_md_top(repo, md):
    if not TOP_ISSUES_LIST:
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

            issues = get_issues_from_label(repo, label)
            if issues.totalCount:
                md.write("## " + label.name + "\n")
                issues = sorted(issues, key=lambda x: x.created_at, reverse=True)
            for issue in issues:
                if not issue:
                    continue
                if isMe(issue):
                    add_issue_info(issue, md)


def main(token):
    user = login(token)
    repo = get_repo(user, "yihong0618/gitblog")
    add_md_header("README.md")
    add_md_top(repo, "README.md")
    add_md_recent(repo, "README.md")
    add_md_label(repo, "README.md")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("github_token", help="github_token")
    options = parser.parse_args()
    main(options.github_token)
