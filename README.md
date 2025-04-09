# dúvidas aula

## erro tabela "mission_completions"
Apontaram esse erro no sprint review 2, mas de momento funciona, apesar de ter que fazer JOIN's em várias tabelas.
Devemos então fazer uma tabela de relação entre a tabela "users" - "missions"? Não é 'redundante' adicionar uma relação similar á "user" - "goals"?

## criar backoffice (pequeno) de gestão

# para parceiros
Dashboard: Fornecer aos parceiros um portal para submeter missões especias/ missões, acompanhar o envolvimento e ajustar campanhas.
    - Completion rates.
    - User demographics (aggregated, not personal data).
    - Reward redemption rates

# para admins
fazer gestão do numero maximo de missões por objetivo ou objetivos por utilizador

## alterações nas missões especiais
Adicionar 3 formas de distinguir os nossos parceiros mais premium
    - Gold: Exclusive mission placement, branded rewards, featured in-app.
    - Silver: Co-branded missions, moderate visibility.
    - Bronze: Basic mission sponsorship, minimal branding.


## User Experience (UX) nas missões especias
    - Adicionar um trigger que permita desativar/ ativar as missões especiais patrocinadas

## adicionar na parte inicial algumas novas formas de adicionar sets de objetivo/missões - por exemplo, após a AI fazer uma analise das respostas, se houver um bom user journey que a IA consiga definir, poder apresentá-lo diretamente e não apenas fazer a sugestão de objetivos e missões
Exemplo de User Journey
    - User define objetivo: "Be more productive."
    - App suggests: "Try a 25-minute Pomodoro session → Sponsored by FocusMate → Win a coaching session."
    - After completion: User rates the mission, unlocking a non-sponsored puzzle mission as a "brain break."

## Community & Social Features
    - Shared Breaks: Let friends sync up for group missions (e.g., "Take a stretch break with [Friend]") - all of them have 5 minutes to complete the mission if one starts it.
    - Sponsor Challenges: Brands could sponsor community-wide events (e.g., "1,000 users complete this mission → Unlock a giveaway").

## Limitações de adição de goals e missões
The "3-2-1 Rule" for New Users
After the questionnaire, enforce these limits temporarily:
    - Max 3 Goals (e.g., "Exercise," "Read," "Sleep Better").
    - Max 2 Missions per Goal (e.g., "Run 3x/week" + "Stretch daily" for "Exercise").
    - 1 Special Mission per day (randomized break).

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
    - "Hábitos Consolidados" -> depois de nos ultimos +30 dias ter uma taxa de conclusão superior a 85% (por exemplo)

