
## Dashskins test

<p>
 Olá, este teste foi realizado com a finalidade de apresentar minhas habilidades com NodeJS juntamente com o NestJs, além dos meus conhecimentos sobre arquitetura limpa e de alguns conceitos de DDD.

 Este projeto conta com algumas tecnologias tais como:
  
  - NestJS
  - NodeJS
  - Postgres
  - Docker
  - Vitest
  - Typescript
  - Eslint
  - Prisma ORM
</p>

 **obs**: Para subir este servidor estamos considerando que você possua o docker instalado em sua máquina. 


## Subindo o servidor
  Primeiramente vamos baixar o repo

  ```shell
    # gh cli
    gh repo clone Gustavo-Murdiga88/dashskins

    # ssh
    git@github.com:Gustavo-Murdiga88/dashskins.git
  ```
  <br>

  Logo após iremos baixar as dependências, no diretório principal execute

   ```shell
   pnpm install
   ```
   <br>

   Em seguida vamos subir nosso container do docker

   ```shell
    docker compose start
   ```
   <br>

  Devemos então executar nossas migrations no banco de dados com o seguinte comando

   ```shell
    pnpm prisma migrate deploy
   ```
   <br>

  E por fim podemos subir nosso servidor
  
   ```shell
    pnpm run dev
   ```
  após este processo, você receberá uma confirmação no seu terminal com todas as rotas hoje disponível no sistema.