import os
import main

from flask import Flask, request


app = Flask(__name__)

# 生成新的md 然后push
def gen_md_and_push(title):
    main.main()
    os.system("./push.sh {}".format(title))


def make_recent_info(content):
    issue = content["issue"]
    time = main.format_time(issue["updated_at"])
    title, url = issue["title"], issue["html_url"]
    return f"- [{title}]({url})--{time}\n"


# change the updated time
def change_recent(md, recent_info):
    with open(md, "r+", encoding="utf-8") as md:
        contents = md.readlines()
        contents.insert(4, recent_info)
        md.seek(0)
        md.writelines(contents)


@app.route("/github", methods=["GET", "POST"])
def github():
    content = request.get_json()
    try:
        if content["action"] == "opened":
            title =  content["issue"]["title"]
            gen_md_and_push(title)
            return "Done"
        elif content["action"] == "created":
            comment_recent = make_recent_info(content)
            change_recent("README1.md", comment_recent)
            return "Done"
    except:
        print("wrong")
        pass
    return "No Need"


if __name__ == "__main__":
       app.run(host="0.0.0.0", port=3333)

