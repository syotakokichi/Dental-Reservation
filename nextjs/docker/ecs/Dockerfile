FROM node:22-bullseye-slim

ARG HOST=0.0.0.0
ARG PORT=3000
ENV HOST ${HOST}
ENV PORT ${PORT}

WORKDIR /workspace

COPY . /workspace

RUN chmod 777 -R /workspace

RUN npm install
RUN npm run build

RUN chmod 777 -R /workspace

EXPOSE ${PORT}

USER node

CMD ["npx", "next", "start"]