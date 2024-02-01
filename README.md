# 專案內容

此專案是一個 Node.js 的後端應用，並使用 Nginx 作為反向代理。將 Node.js 應用和 Nginx 容器化，並使用 Docker Compose 來管理和運行這些容器。

當進行 `git push` 操作時，會觸發 Github Action。此 Action 會使用 SSH 連接到 EC2 instance，並在該 instance 上執行 Git Clone 或 Git Pull 來獲取最新的專案代碼。然後，它會使用 Docker Compose 來啟動或更新 Docker 容器。

## 專案流程

1. 開始
2. 建立 Node.js 應用和 Nginx 容器
3. 使用 Docker Compose 管理和運行容器
4. 進行 git push 操作
5. 觸發 Github Action
6. Github Action 使用 SSH 連接到 EC2 instance
7. 在 EC2 instance 上執行 Git Clone 或 Git Pull 獲取最新的專案代碼
8. 使用 Docker Compose 啟動或更新 Docker 容器
9. 結束

## EC2 Instance 的設定和部署流程

[EC2 Instance 環境建置的 terminal 指令](tutorials/ec2/README.md)

**EC2 instance 要先設定好 SSH 連線的公鑰，在 Github Repo 需要設定秘密變數 ${{ secrets.EC2_SSH_KEY }}，並將其值設定為你的私鑰**。這樣，Github Actions 就可以使用這個私鑰來 SSH 連線到 EC2 instance。

**EC2 instance 要先安裝 Git 、 Docker 和 Docker Compose。** 此外，也需要在 EC2 的安全群組設定中開放 SSH 和你的應用所需的其他端口。

以下是在 EC2 instance 上設定的基本步驟：

1. 建立一個新的 EC2 instance，或選擇一個已經存在的 instance。

2. 在你的本地機器上生成一對 SSH 公鑰/私鑰，並將公鑰添加到 EC2 instance 的 `~/.ssh/authorized_keys` 檔案中。

3. 在 EC2 instance 上安裝 Git 、 Docker 和 Docker Compose。可以參考官方的安裝指南來進行。

4. 在 EC2 的安全群組設定中開放 SSH（通常是 22 端口）和你的應用所需的其他端口。

完成以上步驟後，就可以使用 SSH 連線到 EC2 instance，並在 `git push` 時由 Github Action 自動部署應用了。

# 部署流程

當專案被推送到 GitHub 時，會觸發 GitHub Actions。GitHub Actions 會使用 SSH 連接到 EC2，並在 EC2 上將專案進行 git clone 或 git pull。然後使用 Docker Compose 來運行專案。

## 如何使用

**請確保你的環境已經安裝了 Docker 和 Docker Compose 並開啟 Docker。**

1. 將專案 clone 到你的本地環境：

```bash
git clone < GitHub URL >
```

2. 進入專案目錄：

```
cd < 專案目錄 >
```

3. 使用 Docker Compose 啟動服務：

```
docker-compose up -d
```

4. 用 localhost:80 開啟 Server
