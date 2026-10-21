# Arquitetura: passo a passo

## Etapa 1 - Contratos e verificacoes

Esta etapa aproxima a tipagem do frontend do que o README descreve.

1. `src/types` define os contratos compartilhados pelas telas e pelos servicos. Evita interfaces duplicadas.
2. `PessoaDados` descreve nome e idade enviados no cadastro. `Pessoa` acrescenta o ID obrigatorio de um registro salvo. A atualizacao envia esse ID conforme a API atual.
3. `api.get<Transacao[]>` informa ao TypeScript o formato esperado. Os tipos dos parametros de map, filter e reduce passam a ser inferidos, corrigindo o build do relatorio.
4. `unknown` exige verificar o erro antes de acessar suas propriedades. `src/utils/mensagemErro.ts` faz essa verificacao e extrai texto ou campos de ProblemDetails.
5. `eslint.config.js` ativa verificacoes de TypeScript, Hooks e React Refresh com as dependencias existentes.

Para estudar, leia types/pessoa.ts, services/pessoaService.ts e pages/Pessoas.tsx, nessa ordem. Observe como a mesma definicao acompanha os dados entre as responsabilidades.

Tipos TypeScript verificam o codigo na compilacao; nao validam o JSON recebido em execucao. As regras de negocio e validacoes da API serao tratadas em outra etapa. Os campos numericos de tipo e finalidade ainda seguem o contrato atual.

Validacao: execute `npm run build` e `npm run lint`. Esses comandos nao substituem testes integrados com a API.

## Etapa 2a — Serviço HTTP de categorias

Implementada apenas para categorias, para estudar uma responsabilidade de cada vez.

1. Corrigimos a exclusão no serviço: a API atende `/categoria/{id}`, no singular.
2. A tela `src/pages/Categorias.tsx` passou a usar `categoriaService` nas quatro operações. Ela não importa mais o cliente HTTP nem define endpoints ou verbos HTTP.
3. O formulário monta `CategoriaDados` para criar uma categoria. Na atualização, acrescenta o ID obrigatório de `Categoria`, pois a API atual compara o ID da URL com o ID do corpo.
4. O serviço usa `void` como tipo da resposta de atualização e exclusão, pois esses endpoints retornam HTTP 204, sem corpo.

O fluxo agora é `Categorias.tsx → categoriaService.ts → api.ts → API`.

A tela continua responsável pelo formulário, confirmação de exclusão, mensagens e atualização do estado. O serviço define como executar cada operação HTTP. `api.ts` concentra a configuração compartilhada, como a URL base. Os tipos descrevem os dados trocados entre essas partes.

Exemplo: a leitura que antes usava `api.get<Categoria[]>("/categoria")` agora chama `categoriaService.listar()`. A tela ainda recebe uma resposta Axios e utiliza `res.data`; esconder esse formato não faz parte desta etapa.

### Como revisar

Leia os quatro métodos de `src/services/categoriaService.ts`. Depois localize suas chamadas em `src/pages/Categorias.tsx`. Observe que o serviço não utiliza estado React, alertas ou confirmações.

Execute `npm run build` e `npm run lint`. Para conferir a integração com a API em execução, cadastre uma categoria sem lançamentos, edite-a e exclua-a. Confira também se a API impede a exclusão de uma categoria vinculada a transações. A verificação manual altera dados; utilize dados de teste.

## Proximas etapas (ainda nao implementadas)

2b. Aplicar serviços às transações e configurar a URL por ambiente. Categorias já usam o serviço.
3. Consumir o endpoint de relatorios da API, centralizando os calculos.
4. Separar estado e carregamento em hooks e extrair componentes.
5. Introduzir DTOs e servicos de aplicacao na API: controllers cuidam do HTTP, servicos coordenam regras, DbContext acessa o banco.
6. Testar regras e revisar erros, acessibilidade e exclusoes.

A separacao completa de responsabilidades descrita no README depende das etapas seguintes.
