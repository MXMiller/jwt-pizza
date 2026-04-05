# Incident: 2026-04-05 16-47-30

## Summary

```md
Between 16:45 UTC and 17:21 UTC on 04-05-2026, 11 users where unable to orders pizzas. The event was caused by external code injected into the app at 10:29 that prevented the app from reaching the JWT Pizza factory server. 

The event was detected by our metrics alerts. The team started checking the logs at the that time the error began and found a linnk in the http response that solved the error. 
```

## Detection

```md
The incident was detected by our grafana metrics at 16:47:30 UTC grafana sent an alert. 

Better push notifications will be set up so that grafana alerts sent to email will trigger a notification. 
```

## Impact

```md
For 36 minutes between 16:45 UTC and 17:21 UTC on 04-05-2026, 11 users where unable to order pizzas. 

0 support tickets or social media posts where made. 
```

## Timeline

```md
All times are UTC.

- _16:29:24_ - Attacker injects chaos monkey into https://pizza-factory.cs329.click/api/order. 
- _16:29:24_ - A small number of orders fail. 
- _16:45:13_ - User orders begin failing. 
- _16:45:30_ - Alert is sent. 
- _17:20:00_ - Max Miller sees alert and begins checking logs. 
- _17:21:00_ - Max Miller sees that orders are failing, follows link in http response, and resolves the issue. 
- _17:21:00_ - User orders begn working again. 
```

## Response

```md
Max was sent a page at 16:47:30 UTC. They saw the email at 17:19:00 UTC and resolved the issue at 17:21:00 UTC. 
```

## Root cause

```md
An error was caused by a hostile injection into the apps connection to the JWT Pizza factory server. 
```

## Resolution

```md
By following the link the order http response, the connection to the server was fixed and users could order pizzas again. 
```

## Prevention

```md
This is the first incident of it's kind this app has experianced. 
```

## Action items

```md
 1. Imporved notifications to respond to alerts faster. 
 2. Improved connection security to prevent hostile injections. 
```