https://d1-tutorial.tomascollins.workers.dev/

Generate migration file
```
npm run db:migrate
```

Setup db (run migration)
```
wrangler d1 execute hello-world --local --file=./schema.sql
```

Run sql
```
wrangler d1 execute hello-world --local --command='SELECT * FROM score'
```

## ToDo

### Chores
- [ ] put drizzle into middleware?
- [x] filter by day of the week
- [ ] auth + login
- [ ] styling - buttons + container + daylist

### Features
- [ ] add fitness tracking
- [ ] food diary
- [ ] hard 75
