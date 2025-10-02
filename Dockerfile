#u23527685
FROM node:lts
ENV PORT=3000
ENV MONGODB_URI="mongodb+srv://ProjectUser:ProjecyUser77@databases.rkr0bx9.mongodb.net/?retryWrites=true&w=majority&appName=Databases"
ENV DB_NAME="VeyoDatabase"
WORKDIR /23527685
COPY . .
RUN npm install
EXPOSE 3000
CMD [ "npm", "start" ]