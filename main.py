# -*- coding: utf-8 -*-
import argparse
import os
import re

import markdown
from feedgen.feed import FeedGenerator
from github import Github
from lxml.etree import CDATA
from marko.ext.gfm import gfm as marko

MD_HEAD = """## [Gitblog](https://yihong0618.github.io/gitblog/)
My personal blog([About Me](https://github.com/yihong0618/gitblog/issues/282)) using issues and GitHub Actions (随意转载，无需署名)
[Things I like](https://github.com/yihong0618/gitblog/issues/311)
![image](https://github.com/user-attachments/assets/a168bf11-661e-4566-b042-7fc9544de528)
[RSS Feed](https://raw.githubusercontent.com/{repo_name}/master/feed.xml)
"""

BACKUP_DIR = "BACKUP"
ANCHOR_NUMBER = 5
TOP_ISSUES_LABELS = ["Top"]
TODO_ISSUES_LABELS = ["TODO"]
FRIENDS_LABELS = ["Friends"]
ABOUT_LABELS = ["About"]
THINGS_LABELS = ["Things"]
IGNORE_LABELS = (
    FRIENDS_LABELS
    + TOP_ISSUES_LABELS
    + TODO_ISSUES_LABELS
    + ABOUT_LABELS
    + THINGS_LABELS
)

FRIENDS_TABLE_HEAD = "| Name | Link | Desc | \n | ---- | ---- | ---- |\n"
FRIENDS_TABLE_TEMPLATE = "| {name} | {link} | {desc} |\n"
FRIENDS_INFO_DICT = {
    "名字": "",
    "链接": "",
    "描述": "",
}


def get_me(user):
    return user.get_user().login


def is_me(issue, me):
    return issue.user.login == me


def is_hearted_by_me(comment, me):
    reactions = list(comment.get_reactions())
    for r in reactions:
        if r.content == "heart" and r.user.login == me:
            return True
    return False


def _make_friend_table_string(s):
    info_dict = FRIENDS_INFO_DICT.copy()
    try:
        string_list = s.splitlines()
        # drop empty line
        string_list = [l for l in string_list if l and not l.isspace()]
        for l in string_list:
            string_info_list = re.split("：", l)
            if len(string_info_list) < 2:
                continue
            info_dict[string_info_list[0]] = string_info_list[1]
        return FRIENDS_TABLE_TEMPLATE.format(
            name=info_dict["名字"], link=info_dict["链接"], desc=info_dict["描述"]
        )
    except Exception as e:
        print(str(e))
        return


# help to covert xml vaild string
def _valid_xml_char_ordinal(c):
    codepoint = ord(c)
    # conditions ordered by presumed frequency
    return (
        0x20 <= codepoint <= 0xD7FF
        or codepoint in (0x9, 0xA, 0xD)
        or 0xE000 <= codepoint <= 0xFFFD
        or 0x10000 <= codepoint <= 0x10FFFF
    )


def format_time(time):
    return str(time)[:10]


def login(token):
    return Github(token)


def get_repo(user: Github, repo: str):
    return user.get_repo(repo)


def parse_TODO(issue):
    body = issue.body.splitlines()
    todo_undone = [l for l in body if l.startswith("- [ ] ")]
    todo_done = [l for l in body if l.startswith("- [x] ")]
    # just add info all done
    if not todo_undone:
        return f"[{issue.title}]({issue.html_url}) all done", []
    return (
        f"[{issue.title}]({issue.html_url})--{len(todo_undone)} jobs to do--{len(todo_done)} jobs done",
        todo_done + todo_undone,
    )


def get_top_issues(all_issues):
    top_issues = []
    for issue in all_issues:
        if any(label.name in TOP_ISSUES_LABELS for label in issue.labels):
            top_issues.append(issue)
    return top_issues


def get_todo_issues(all_issues):
    todo_issues = []
    for issue in all_issues:
        if any(label.name in TODO_ISSUES_LABELS for label in issue.labels):
            todo_issues.append(issue)
    return todo_issues


def get_repo_labels(all_labels):
    return all_labels


def get_issues_from_label(all_issues, label_name):
    issues_with_label = []
    for issue in all_issues:
        if any(label.name == label_name for label in issue.labels):
            issues_with_label.append(issue)
    return issues_with_label


# Renamed from add_issue_info, returns a string now
def format_issue_line(issue):
    time = format_time(issue.created_at)
    return f"- [{issue.title}]({issue.html_url})--{time}\n"


# Renamed from add_md_todo, returns a string now
def generate_md_todo_section(all_issues, me): # Changed repo to all_issues
    content_parts = []
    todo_issues = list(get_todo_issues(all_issues)) # Use all_issues
    if not TODO_ISSUES_LABELS or not todo_issues:
        return ""

    content_parts.append("## TODO\n")
    for issue in todo_issues:
        if is_me(issue, me):
            todo_title, todo_list = parse_TODO(issue)
            content_parts.append("TODO list from " + todo_title + "\n")
            for t in todo_list:
                content_parts.append(t + "\n")
            content_parts.append("\n")  # New line after each TODO list
    return "".join(content_parts)


# Renamed from add_md_top, returns a string now
def generate_md_top_section(all_issues, me): # Changed repo to all_issues
    content_parts = []
    top_issues = list(get_top_issues(all_issues)) # Use all_issues
    if not TOP_ISSUES_LABELS or not top_issues:
        return ""

    content_parts.append("## 置顶文章\n")
    for issue in top_issues:
        if is_me(issue, me):
            content_parts.append(format_issue_line(issue)) # Use format_issue_line
    return "".join(content_parts)


# Renamed from add_md_firends, returns a string now
def generate_md_friends_section(repo, all_issues, me): # Added all_issues
    content_parts = []
    table_content_md = FRIENDS_TABLE_HEAD
    
    # Filter all_issues for friends_issues
    friends_issues_list = []
    for issue in all_issues:
        if any(label.name in FRIENDS_LABELS for label in issue.labels):
            friends_issues_list.append(issue)
            
    if not FRIENDS_LABELS or not friends_issues_list:
        return ""
        
    friends_issue_number = friends_issues_list[0].number 
    
    for issue in friends_issues_list: # Iterate over the filtered list
        for comment in issue.get_comments(): 
            if is_hearted_by_me(comment, me):
                friend_row_md = _make_friend_table_string(comment.body or "")
                if friend_row_md: 
                    table_content_md += friend_row_md
    
    html_friends_table = markdown.markdown(table_content_md, output_format="html", extensions=["extra"])
    
    content_parts.append(
        f"## [友情链接](https://github.com/{str(me)}/gitblog/issues/{friends_issue_number})\n"
    )
    content_parts.append("<details><summary>显示</summary>\n")
    content_parts.append(html_friends_table)
    content_parts.append("</details>\n\n\n") 
    return "".join(content_parts)


# Renamed from add_md_recent, returns a string now
def generate_md_recent_section(all_issues, me, limit=5): # Changed repo to all_issues
    content_parts = []
    count = 0
    # one the issue that only one issue and delete (pyGitHub raise an exception)
    try:
        content_parts.append("## 最近更新\n")
        # Sort all_issues by creation date in descending order
        sorted_issues = sorted(all_issues, key=lambda i: i.created_at, reverse=True)
        for issue in sorted_issues: 
            if is_me(issue, me):
                content_parts.append(format_issue_line(issue)) # Use format_issue_line
                count += 1
                if count >= limit:
                    break
    except Exception as e:
        print(str(e)) 
        # Optionally return partial content or empty string, for now, it continues
    return "".join(content_parts)


# Renamed from add_md_header, returns string now
def generate_md_header(repo_name):
    return MD_HEAD.format(repo_name=repo_name) + "\n"


# Renamed from add_md_label, returns a string now
def generate_md_label_section(all_issues, all_labels, me): # Changed repo to all_issues, all_labels
    content_parts = []
    labels = get_repo_labels(all_labels) # Use all_labels

    labels = sorted(
        labels,
        key=lambda x: (
            x.description is None,
            x.description == "",
            x.description,
            x.name,
        ),
    )

    for label in labels:
        if label.name in IGNORE_LABELS:
            continue

        issues_for_label = get_issues_from_label(all_issues, label.name) # Use all_issues and label.name
        issues_for_label = list(sorted(issues_for_label, key=lambda x: x.created_at, reverse=True))
        
        if len(issues_for_label) != 0:
            content_parts.append("## " + label.name + "\n\n")
        
        i = 0
        for issue in issues_for_label:
            if not issue:
                continue
            if is_me(issue, me):
                if i == ANCHOR_NUMBER:
                    content_parts.append("<details><summary>显示更多</summary>\n\n")
                content_parts.append(format_issue_line(issue)) # Use format_issue_line
                i += 1
        
        if i > ANCHOR_NUMBER:
            content_parts.append("</details>\n\n")
            
    return "".join(content_parts)


def get_to_generate_issues(repo, dir_name, issue_number=None):
    md_files = os.listdir(dir_name)
    generated_issues_numbers = [
        int(i.split("_")[0]) for i in md_files if i.split("_")[0].isdigit()
    ]
    to_generate_issues = [
        i
        for i in list(repo.get_issues())
        if int(i.number) not in generated_issues_numbers
    ]
    if issue_number:
        to_generate_issues.append(repo.get_issue(int(issue_number)))
    return to_generate_issues


def generate_rss_feed(repo, filename, me):
    generator = FeedGenerator()
    generator.id(repo.html_url)
    generator.title(f"RSS feed of {repo.owner.login}'s {repo.name}")
    generator.author(
        {"name": os.getenv("GITHUB_NAME"), "email": os.getenv("GITHUB_EMAIL")}
    )
    generator.link(href=repo.html_url)
    generator.link(
        href=f"https://raw.githubusercontent.com/{repo.full_name}/master/{filename}",
        rel="self",
    )
    for issue in repo.get_issues():
        if not issue.body or not is_me(issue, me) or issue.pull_request:
            continue
        item = generator.add_entry(order="append")
        item.id(issue.html_url)
        item.link(href=issue.html_url)
        item.title(issue.title)
        item.published(issue.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"))
        for label in issue.labels:
            item.category({"term": label.name})
        body = "".join(c for c in issue.body if _valid_xml_char_ordinal(c))
        item.content(CDATA(marko.convert(body)), type="html")
    generator.atom_file(filename)


def main(token, repo_name, issue_number=None, dir_name=BACKUP_DIR):
    user = login(token)
    me = get_me(user)
    repo = get_repo(user, repo_name)

    # Fetch all issues and labels once
    all_issues = list(repo.get_issues(state="open")) # Assuming open issues are what we need
    all_labels = list(repo.get_labels())

    readme_content_parts = []

    # Generate content for each section using all_issues and all_labels
    readme_content_parts.append(generate_md_header(repo_name))
    # generate_md_friends_section still needs repo for comments
    readme_content_parts.append(generate_md_friends_section(repo, all_issues, me)) 
    readme_content_parts.append(generate_md_top_section(all_issues, me))
    readme_content_parts.append(generate_md_recent_section(all_issues, me)) # limit default is 5
    readme_content_parts.append(generate_md_label_section(all_issues, all_labels, me))
    readme_content_parts.append(generate_md_todo_section(all_issues, me))

    # Write the consolidated content to README.md
    final_readme_text = "".join(readme_content_parts)
    with open("README.md", "w", encoding="utf-8") as f:
        f.write(final_readme_text)

    # Update generate_rss_feed and get_to_generate_issues to use all_issues
    # generate_rss_feed still needs repo for some metadata.
    generate_rss_feed(repo, all_issues, "feed.xml", me) 
    # get_to_generate_issues might still need repo for fetching a specific issue_number not in all_issues.
    to_generate_issues = get_to_generate_issues(repo, all_issues, dir_name, issue_number)

    # save md files to backup folder
    for issue in to_generate_issues:
        save_issue(issue, me, dir_name)


# The following functions might need adjustment based on whether they were part of the earlier refactoring subtask
# to use all_issues. Assuming they are for now.
def get_to_generate_issues(repo, all_issues, dir_name, issue_number=None): # Added all_issues
    md_files = os.listdir(dir_name)
    generated_issues_numbers = { # Use set for faster lookups
        int(i.split("_")[0]) for i in md_files if i.split("_")[0].isdigit()
    }
    
    issues_to_backup = []
    backed_up_issue_numbers = set()

    # If a specific issue_number is provided, prioritize it.
    if issue_number:
        issue_num_int = int(issue_number)
        specific_issue_obj = None
        # Try to find in all_issues first
        for issue_obj in all_issues:
            if issue_obj.number == issue_num_int:
                specific_issue_obj = issue_obj
                break
        
        if specific_issue_obj:
            if specific_issue_obj.number not in backed_up_issue_numbers:
                issues_to_backup.append(specific_issue_obj)
                backed_up_issue_numbers.add(specific_issue_obj.number)
        else:
            # If not found in all_issues, fetch it directly using repo
            try:
                print(f"Issue {issue_num_int} not found in pre-fetched issues, fetching directly.")
                specific_issue_obj = repo.get_issue(issue_num_int)
                if specific_issue_obj.number not in backed_up_issue_numbers: # Should always be true here
                    issues_to_backup.append(specific_issue_obj)
                    backed_up_issue_numbers.add(specific_issue_obj.number)
            except Exception as e:
                print(f"Error fetching specific issue {issue_num_int}: {e}")

    # Then, scan for other issues not yet backed up from all_issues.
    for issue_obj in all_issues:
        if issue_obj.number not in generated_issues_numbers and issue_obj.number not in backed_up_issue_numbers:
            issues_to_backup.append(issue_obj)
            # backed_up_issue_numbers.add(issue_obj.number) # Not strictly necessary here as we only iterate all_issues once for this part
            
    return issues_to_backup


def generate_rss_feed(repo, all_issues, filename, me): # Added all_issues
    generator = FeedGenerator()
    generator.id(repo.html_url)
    generator.title(f"RSS feed of {repo.owner.login}'s {repo.name}")
    generator.author(
        {"name": os.getenv("GITHUB_NAME"), "email": os.getenv("GITHUB_EMAIL")}
    )
    generator.link(href=repo.html_url)
    generator.link(
        href=f"https://raw.githubusercontent.com/{repo.full_name}/master/{filename}",
        rel="self",
    )
    for issue in all_issues: # Use all_issues
        if not issue.body or not is_me(issue, me) or issue.pull_request:
            continue
        item = generator.add_entry(order="append")
        item.id(issue.html_url)
        item.link(href=issue.html_url)
        item.title(issue.title)
        item.published(issue.created_at.strftime("%Y-%m-%dT%H:%M:%SZ"))
        for label in issue.labels:
            item.category({"term": label.name})
        body = "".join(c for c in issue.body if _valid_xml_char_ordinal(c))
        item.content(CDATA(marko.convert(body)), type="html")
    generator.atom_file(filename)


def save_issue(issue, me, dir_name=BACKUP_DIR):
    md_name = os.path.join(
        dir_name, f"{issue.number}_{issue.title.replace('/', '-').replace(' ', '.')}.md"
    )
    with open(md_name, "w") as f:
        f.write(f"# [{issue.title}]({issue.html_url})\n\n")
        f.write(issue.body or "")
        if issue.comments:
            for c in issue.get_comments():
                if is_me(c, me):
                    f.write("\n\n---\n\n")
                    f.write(c.body or "")


if __name__ == "__main__":
    if not os.path.exists(BACKUP_DIR):
        os.mkdir(BACKUP_DIR)
    parser = argparse.ArgumentParser()
    parser.add_argument("github_token", help="github_token")
    parser.add_argument("repo_name", help="repo_name")
    parser.add_argument(
        "--issue_number", help="issue_number", default=None, required=False
    )
    options = parser.parse_args()
    main(options.github_token, options.repo_name, options.issue_number)
