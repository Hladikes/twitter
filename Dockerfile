FROM node:current-alpine3.16
WORKDIR app
COPY . .
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "deploy"]