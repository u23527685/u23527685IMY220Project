#u23527685
FROM node:lts
ENV PORT=3000
WORKDIR /23527685
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]