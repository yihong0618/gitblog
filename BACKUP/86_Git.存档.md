# [Git 存档](https://github.com/yihong0618/gitblog/issues/86)

怎么修改git commit 信息
1. git commit --amend 本地
2. git commit --amend
git push origin master --force 刚push
3. git rebase -i HEAD~X X is the number of commits to go back
Move to the line of your commit, change pick into edit,
then change your commit message:
git commit --amend
Finish the rebase with:
git rebase --continue 本地没push old

---

撤销commit
git reset --soft HEAD^

---

checkout 正则git checkout -- '*.py'

---

remove from add 
git reset 

---

Git+Gerrit如何永久删除历史文件（大文件/私密文件）
https://www.jianshu.com/p/085552205f19

---

add .gitkeep to empty folder

---

```
query GetUsers {
  search(query: "location:China", first: 100, type: USER) {
    userCount
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        ... on User {
          email
          login
          location
          url
          followers {
            totalCount
          }
        }
      }
    }
  }
}

```

---

只有这个答案是对的。。
https://stackoverflow.com/questions/34610705/git-windows-and-linux-line-endings