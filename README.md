# PON 2020 -  Spartacus

## Prenotazione Aule Istituto

- Node.js server
- Desktop client
- Android client (tbd)

The client is built with [angularjs](https://angularjs.org/).
The server runs over a Node.js instance [node.js](https://nodejs.org/en/)

## Install

It requires:
* [Git](https://git-scm.com/)
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
  
   <_If URL params exist, specify them in accordance with name mentioned in URL section. Separate into optional and required. Document data constraints._> 

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
 
