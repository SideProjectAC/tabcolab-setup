## EC2 Instance 的設定和部署流程

Amazon Linux 2 是基於 Red Hat Enterprise Linux (RHEL) 的一個開源 Linux 發行版，並且支援多種硬體架構，包括 x86_64 和 ARM64。

**在 Amazon Linux 2 中，預設軟體套件管理工具為 YUM**

以下是在 AWS EC2 Linux 2 instance 上安裝、設定 Docker、Docker Compose 和 Git 的步驟：

1. 檢查系統更新：

   ```bash
   sudo yum update -y
   ```

2. 安裝 Docker：

   ```bash
   sudo amazon-linux-extras install docker
   ```

3. 使 Docker 在每次系統重新啟動後自動啟動：

   ```bash
   sudo systemctl enable docker
   ```

4. 設定 Docker 管理者，未來在執行 Docker 命令時就不用加 sudo：

   ```bash
   sudo nano /etc/group
   ```

   到文件最下方，在 docker 後方加上 ec2-user ，看起來會像這樣：`docker:x:992:ec2-user`

5. 重啟系統：

   ```bash
   sudo reboot
   ```

6. 重啟後檢查是否已成功安裝，輸入以下指令後有出現 Docker 資訊即為成功安裝：

   ```bash
   docker info
   ```

7. 啟動 Docker 服務並設定開機自動啟動：

   ```bash
   sudo service docker start
   sudo chkconfig docker on
   ```

8. 安裝 Git：

   ```bash
   sudo yum install -y git
   ```

9. 安裝 Docker Compose：
   ```bash
   sudo curl -L https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
   sudo chmod +x /usr/local/bin/docker-compose
   ```
   檢查 Docker Compose 是否安裝成功：
   ```bash
   docker-compose version
   ```

## 將本地端公鑰加到 EC2

1. 在本地端生成 SSH 公鑰和私鑰：

   ```bash
   ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
   ```

   這個指令會在 `~/.ssh` 目錄下生成 `id_rsa`（私鑰）和 `id_rsa.pub`（公鑰）兩個檔案。`-C` 選項後面的 `"your_email@example.com"` 是你的電子郵件地址，用於識別這個鑰匙。

   在生成鑰匙的過程中，可以選擇是否要設定密碼。如果不想設定密碼，直接按 Enter 即可。

2. 本地端公鑰查詢：

   ```bash
   PUBLIC_KEY=$(cat ~/.ssh/id_rsa.pub)
   echo $PUBLIC_KEY
   ```

3. 將本地端公鑰加到 EC2：
   ```bash
   ssh ec2-user@your-ec2-ip-address 'echo '$PUBLIC_KEY' >> ~/.ssh/authorized_keys'
   ```
