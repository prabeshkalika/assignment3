FROM node:14-alpine
WORKDIR /app
COPY app.js /app
RUN npm install
ENV PORT=80
CMD ["node", "app.js"]
