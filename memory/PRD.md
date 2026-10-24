# PRD — Jakeline Safadinha | Landing Page + Painel Admin

## Problem statement (resumo)
Landing page premium, feminina, sensual, dark, mobile-first e focada em conversão para a persona "Jakeline Safadinha" (conteúdo adulto +18, marketing apenas). Funil: Instagram → Landing → Prova Social → Grupo FREE (Telegram) → Planos VIP → WhatsApp → Telegram/Bot → Grupo VIP. Sem checkout no site: todos os planos levam ao WhatsApp. Painel administrativo protegido por login para controlar praticamente tudo (conteúdo, cores, imagens, preços, seções, notificações) sem tocar em código.

## Limites acordados com a usuária (24/10/2026)
- Notificações ao vivo SOMENTE com eventos reais (visitas/cliques registrados). Sem vendas falsas com nomes aleatórios.
- Depoimentos e prints: apenas PLACEHOLDERS claramente marcados, substituídos pela usuária via painel.
- Contador regressivo com data real; esconde após expirar; sem reinício automático (sem falsa urgência).

## Personas
- Visitante (mobile, vem do Instagram): quer confiança, prova social e caminho claro para FREE/VIP.
- Admin (a própria Jakeline): edita tudo pelo painel, acompanha analytics reais.

## Arquitetura
- Frontend: React 19 + Tailwind + framer-motion + lenis + embla-carousel. Rota "/" pública, "/admin/login" e "/admin" protegidos.
- Backend: FastAPI + Motor (MongoDB). Auth JWT (cookie httpOnly + Bearer fallback), bcrypt, brute-force lockout.
- Banco: users, site_config (doc único "_id: site"), testimonials, prints, previews, faqs, events (analytics), login_attempts.
- Uploads: /app/backend/uploads servido em /api/uploads (máx 8MB).

## Implementado (24/10/2026)
- Landing completa: Hero (reveal cinético + parallax), marquee editorial, Prova Social (nota, distribuição, cards), Prints (carrossel), Números, FREE, Prévias (carrossel autoplay), VIP (benefícios), Planos (3, card destaque com tracing beam), Promoção (countdown real), Como Funciona, FAQ, CTA final, Footer, botão WhatsApp flutuante, notificações ao vivo com eventos reais.
- Ordem/visibilidade de seções via config (drag-and-drop no painel com framer-motion Reorder).
- Painel admin: login JWT, 14 abas (Visão Geral, Identidade & Links, Aparência, Hero, Prova Social, Depoimentos, Prints, Prévias, Planos, Promoção, Conteúdo, FAQ, Seções, Notificações), CRUD completo, upload de imagens, tema de cores editável.
- Analytics 100% real: visitas (por IP), cliques WhatsApp/FREE/VIP/por plano, plano mais clicado, origem do tráfego, visitas por dia (14d), eventos recentes.
- Tracking público (/api/track) com sendBeacon.

## Backlog priorizado
- P0: usuária substituir placeholders (foto hero, prévias, prints, depoimentos) e configurar links reais (WhatsApp, Telegram, Instagram).
- P1: Editor visual com preview ao vivo (painel à esquerda, preview à direita).
- P1: Troca de senha pelo painel.
- P2: Tipografia editável (fontes/tamanhos) e gradientes no painel.
- P2: Temas prontos (presets de paleta).
- P2: Exportar/backup de configurações.

## Próximas tarefas sugeridas
1. Preview ao vivo no painel (iframe da landing ao lado do editor).
2. Campo de troca de senha no admin.
3. Presets de paleta de cores.
