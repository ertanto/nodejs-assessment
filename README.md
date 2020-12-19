# NodeJS API Assessment

## Requirements
-  Node ver 12+

## Setting up
1. Install project dependencies

    `npm install`

2. Spin up docker containers for mysql databases (assessment & assessment_test)

    `docker-compose -f "docker-compose.yml" up -d --build`

3. Create tables in 'assessment' database

    `npm run migrate`

 4. Create tables in 'assessment_test' database

    `npm run migrate:test`

5. Start API Server locally (http://localhost:3000)

    `npm run start`

## Run Test
For running test
    `npm run test`
