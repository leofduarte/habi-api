# dúvidas aula

# criar backoffice (pequeno) de gestão

## para parceiros
Dashboard: Fornecer aos parceiros um portal para submeter missões especias/ missões, acompanhar o envolvimento e ajustar campanhas.
    - Completion rates.
    - User demographics (agregados, não dados pessoais).
    - Reward redemption rates

+  - categorizar 

## para admins
fazer gestão do numero maximo de missões por objetivo ou objetivos por utilizador - etc...

# alterações nas missões especiais
Adicionar 3 formas de distinguir os nossos parceiros mais premium
    - Gold: Colocação exclusiva de missão, recompensas personalizadas com a marca, destaque na aplicação.
    - Silver: Missões com visibilidade moderada.
    - Bronze: Patrocínio básico de missão, marca mínima.

# User Experience (UX) nas missões especias
    - Adicionar um trigger que permita desativar/ ativar as missões especiais patrocinadas

### User journey experience 
- adicionar na parte inicial algumas novas formas de adicionar sets de objetivo/missões - por exemplo, após a AI fazer uma analise das respostas, se houver um bom user journey que a IA consiga definir, poder apresentá-lo diretamente e não apenas fazer a sugestão de objetivos e missões

Exemplo de User Journey
    - User define objetivo: "Be more productive."
    - App sugere: "Try a 25-minute Pomodoro session → Sponsored by FocusMate → Win a coaching session."
    - A completion: User rates the mission, unlocking a non-sponsored puzzle mission as a "brain break."

## BJ Fogg’s method
Após o questionário inicial, a IA identifica padrões (ex.: "você prioriza saúde mental + tem pouco tempo") e gera user journey com:
    - 1 meta principal (ex.: "Reduzir ansiedade").
    - Missões pré-definidas (ex.: "Respiração 2x/dia", "Diário de gratidão 3x/semana").
    - Timeline sugerida (ex.: "Semana 1: Consciência; Semana 2: Ação"). -> talvez isto já gera mais complexidade, talvez manter por base os pontos acima.

## Feature mais social e de comunidade
    - Pausas Partilhadas: Permitir que amigos sincronizem missões em grupo (por exemplo, "Fazer uma pausa para alongamentos com [Amigo]") - todos têm 5 minutos para completar a missão quando um a inicia.
+    - Desafios Patrocinados: As marcas podem patrocinar eventos para toda a comunidade (por exemplo, "1.000 utilizadores completam esta missão → Desbloquear um sorteio").

## Limitações de adição de goals e missões
A "Regra 3-2-1" para Novos Utilizadores
Após o questionário, implementar temporariamente estes limites: 
    - Máximo 3 Objetivos (ex.: "Exercício", "Leitura", "Dormir Melhor"). 
    - Máximo 2 Missões por Objetivo (ex.: "Correr 3x/semana" + "Alongar diariamente" para "Exercício"). 
    - 1 Missão Especial por dia (pausa aleatória).

    <!--! (poucos obketivos e mais missções) feedback -->

- Promover o desbloqueio ao progresso -> ao atingir milestones, desbloquear novos espaços para missões, objetivos

## converter missão a hábito 
    usar o método de "habit stacking"
1º
    - Ancorar/ juntar Missões a Hábitos Existentes
    - Começar Extremamente Pequeno
        - Primeiros 3-7 dias: As missões devem parecer sem esforço (ex: "Ler 1 página", "Fazer 1 flexão").
        - Porquê? Constrói vitórias iniciais e reduz resistência
2º
    - Nunca permitir que os utilizadores pulem duas vezes seguidas. (já temos meio implementado - snooze ✅)
    - Aumentar gradualmente a complexidade das missões apenas após 7+ dias de consistência (apenas naquelas que possam ser incrementadas)
3º
    - "Hábitos Consolidados" -> depois de nos ultimos +30 dias ter uma taxa de conclusão superior a 85% (por exemplo), congratular o user, etc etc

