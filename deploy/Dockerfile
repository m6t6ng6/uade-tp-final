FROM node
LABEL maintainer="m6t6ng6 <fernando.miguel.bustamante@gmail.com"
RUN apt-get update
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json funciones_app.js setup.js app.js ./ 
USER node
RUN npm install
COPY --chown=node:node . .
EXPOSE 5000 
CMD ["node", "app.js"]