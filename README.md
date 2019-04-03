# PON 2020 -  Spartacus

## Prenotazione Aule Istituto

- Node.js server 
- Desktop client
- Android client (tbd)

The client is built with [angularjs](https://angularjs.org/).
The server runs over a Node.js instance [node.js](https://nodejs.org/en/)

**Node.js**

 Per quanto riguarda il server su cui si appoggia il progetto è stato utilizzato node.js.
Node.js è una piattaforma sever side costruita sull'engine javascript di google chrome è un runtime environment open source cross platform.

**MongoDB**
 
 Il database è di tipo noSQL, non relazionale e document oriented. Lo schema di tale database è basato su docuemnti JSON. 
 Come nei DB SQL i campi possono essere indicizzati con indici primari e secondari.
 
**Postman**

Postman è la prima piattaforma di sviluppo API. Tale piattoforma è stata utilizzata per delle simulazioni di chiamata al database. 
 
## Install

It requires:
* [Git](https://git-scm.com/)
 per quanto riguarda il server su cui si appoggia il progetto, è stato utilizzato node.js 
* [node.js](https://nodejs.org/en/)
* [Mongo](https://www.mongodb.com/)

* git clone https://github.com/monkeydroid/spartacus.git
* cd spartacus/
* npm install
* 
* node app.js

The server will run on port 3500.
You can test it in the (Chrome [https] or Firefox) browser at localhost:3500.

## DB Diagram

![alt text](https://github.com/monkeydroid/spartacus/blob/master/img/ervero.png)

**Esempi chiamate**
----

  Di seguito verranno mostrati degli esempi di chiamate da parte del frontend e il relativo risultato backend in formato **JSON**
  

* **Aggiunta prenotazione**

  `/api/addprenotation`
  


* **Method:**

  `POST` 
  
*  **URL Params**

   - roomid 
   - user 
   - tipology
  


   **Required:**
 
   - `roomid=[integer]`
   - `user=[string]`
   - `tipology=[integer]`

   **Optional:**
 
 

* **Data Params**

   |  Key     | Value   |
   |----------|:-------:|
   |`roomid`  | 5       |
   |`user`    | foo     |
   |`tipology`|13|
   
* **Success Response:**
  ```javascript
  {
	"roomid": 5,
	"user": "foo",
	"tipology": 13
  }
  ```

 
* **Error Response:**
   ```javascript
  {
	"status": 0,
	"message": "roomid not found"
  }
  ```
 
