*Сорян за рідмі*

Сорян за тайпскрипт, реакт і некс замість "ванільного" джс, але to my deffence весь код скомпільовано в es3 *(ну як мінімум так мені сказав tsconfig.json)*

## **А що з цього можна запустити?**
### Варіант 1: захостити деку `/out`
Повністю статично сгенеровані сторінки знаходяться в `/out` але через те, що предмети я підвантажую окремо, всю цю папки треба хостити через http
### Варіант 2: перейти на заздалегідь мною захощену сторінку
За [цим посиланням](https://malien.github.io) можна знайти точно той самий проект (та сама папка `/out`). Проте є шанс що хост працювти не буде тоді можна повідомити мене (`@q_link0_p`), але це займе більше часу
### Варіант 3: збудувати проект самому
Так, звучить погано, але все не так страшно. З переваг те, що сторінки будуть сервер-сайд рендернуті з данними продуктів. Команди знизу запустять проект на [localhost:3000](http://localhost:3000)
```
npm install
npm run build
npm start
```
### Варіант 4: сказати що лаба не задовільняє вимогам і поставити 0
Якщо все таки так склалось, я вибачаюсь... 

*\*Тут починається частина де я плачусь за те щоб не поставили 0\**

Сподіваюсь я не сильно витрачаю ваш час на цей рідмі, та на цей проект. Останнє щоб мені хотілося б це затягувати вам процесс оцінки, та проте так вийшло

Я думав зробити дві версії, одну цю, іншу продовжити з того, що було здато на 1-шу і 2-гу лаби, але якщо ви зараз читаєте це, то десь таки я зафакапив (_**upd**: і вже виправив_). Початково я хотів спробувати зробити новий вигляд сітки товарів з адаптивною розтановкою "без дірок" та почавши розвивати цю ідею, це все вилилось в реакт і некст (некст тому, що я хотів спробувати погратися з сервер сайт рендерингом)

### Варіанти захостити:
- Є маленький npm пакет `serve`, встановити глобально, і запустити в деці `/out` через `serve -p <port number>`
- Apache / nginx
- Можливо до часу здачі я напишу невеличкий http сервер і вкину його всередину пакету

# UPD:
Я провів цілий день портуючи версію корзини з реакту на ваніль, та версія валяється у кореновому каталозі як `/LabVanilla`