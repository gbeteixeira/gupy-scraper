# Job Matching Bot

Este projeto é uma ferramenta para comparar seu currículo com vagas de emprego disponíveis e calcular a porcentagem de compatibilidade entre eles. Ideal para desenvolvedores em busca de um novo desafio!

## Como Funciona

1. **Acesse o Endpoint:**
   - Utilize o endpoint `/find-jobs/{jobname}` para buscar vagas (exemplo: `http://localhost:3333/find-jobs/fullstack`).
   - Parâmetros opcionais:
     - `badges` = país de origem da vaga
     - `isRemoteWork` = true | false
     - `publishedDate` = data de publicação

2. **Processamento das Vagas:**
   - O bot busca todas as vagas disponíveis no Gupy para a pesquisa realizada.
   - As vagas são salvas no banco de dados e enviadas para a fila de processamento.
   - A foto do seu currículo é enviada ao Gemini para calcular a porcentagem de compatibilidade com as vagas.
   - As vagas processadas são salvas no banco de dados.

## Instalação

Para rodar a aplicação localmente, siga os passos abaixo:

1. Instale as dependências:
   ```bash
   bun install
   ```

2. Copie o arquivo de exemplo para o `.env`:
   ```bash
   cp .env.example .env
   ```

3. Gere e migre o banco de dados:
   ```bash
   npx prisma generate && npx prisma migrate dev
   ```

4. Inicie a aplicação:
   ```bash
   bun run dev
   ```

5. Substitua a imagem `cv.png` pela imagem do seu currículo (mantendo o nome e extensão).

## Uso

Para buscar vagas, acesse o endpoint configurado e adicione os parâmetros desejados. O sistema processará as vagas e retornará a porcentagem de compatibilidade entre seu currículo e as vagas encontradas.

## Contribuição

Sinta-se à vontade para contribuir com o projeto! Se você encontrar algum problema ou tiver sugestões, por favor, abra uma issue ou faça um pull request.

## Licença

Este projeto é licenciado sob a [MIT License](LICENSE).

## Contato

Se você tiver dúvidas ou precisar de ajuda, entre em contato comigo através do [LinkedIn](https://www.linkedin.com/in/gabrielteixeira1/).

---

Dê um `git clone` no repositório e aproveite! 🚀

Vamos juntos encontrar o próximo desafio! 💼

#Desenvolvimento #Tecnologia #BuscaDeEmprego #DevTools #Programação
