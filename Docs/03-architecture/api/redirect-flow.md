# Fluxo de Redirecionamento

O redirecionamento é o caminho crítico do produto e deve executar apenas o necessário para levar o visitante ao destino corretamente.

```text
GET /{shortCode}
      ↓
Resolver ShortCode
      ↓
URL existe?
      ↓
URL está ativa?
      ↓
Registrar evento de clique
      ↓
302 + Location: LongURL
```

## Caminho crítico x processamento secundário

O visitante não deveria sofrer atraso desnecessário por causa de analytics.

Na primeira implementação, o fluxo pode ser simples. Para escala maior, deve ser avaliado se o registro de eventos precisa ser desacoplado por processamento assíncrono ou mensageria.

Isso é uma preocupação futura, não uma exigência de implementação antecipada.
