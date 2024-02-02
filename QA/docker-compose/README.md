Q: node.js 專案跟 nginx 分別是兩個獨立的 image，docker-compose 後為什麼能夠互通並能夠反向代理成功

A: 在 Docker Compose 中，所有的服務都在同一個網路中運行，因此它們可以使用服務名稱作為主機名來相互通信。以下是一個範例的 docker-compose.yml 文件，其中包含兩個服務：一個 Node.js 應用和一個 Nginx 服務。

```yml
version: "3"
services:
  app:
    image: node:14
    volumes:
      - .:/app
    working_dir: /app
    command: npm start
    ports:
      - 3000:3000
    networks:
      - app_network
  nginx:
    image: nginx:latest
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    ports:
      - 80:80
    networks:
      - app_network
networks:
  app_network:
```

在這個配置中，app 服務是你的 Node.js 應用，nginx 服務是你的 Nginx 服務。你可以在 Nginx 配置文件中使用 http://app:3000 來訪問你的 Node.js 應用。這裡的 app 是你的 Node.js 應用的 Docker Compose 服務名稱，3000 是你的 Node.js 應用在 Docker 容器內部監聽的端口。

app 服務和 nginx 服務都連接到 app_network 網路。因此，它們可以使用服務名稱（例如 app 或 nginx）來相互通信。

Q: docker-compose 中有一個服務要用到另一個服務的資料，要怎麼連結

A:
