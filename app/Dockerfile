# Use an official Node.js runtime as a parent image
FROM node:21-alpine

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json to /app
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to /app
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]

# # 使用 Nginx 作为运行时镜像
# FROM nginx

# # 将自定义的 Nginx 配置文件复制到容器中
# COPY nginx.conf /etc/nginx/nginx.conf

# # # 从 Node.js 阶段复制构建好的项目文件到 Nginx 的默认站点目录
# # COPY --from=0 /app/dist /usr/share/nginx/html

# # 暴露 Nginx 的默认端口
# EXPOSE 80

# # 複製 deploy.sh 到 Docker 容器中
# COPY deploy.sh .

# # 給予 deploy.sh 執行權限
# RUN chmod +x deploy.sh

# # 執行 deploy.sh
# CMD ["./deploy.sh"]