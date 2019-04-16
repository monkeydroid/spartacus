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
  

**Aggiunta prenotazione**

  `/api/addprenotation`
  


* **Method:**

  `POST` 
  
*  **URL Params**

   - prenotation_day
   - xml
   - id_room 
   - id_user 
   - prenotation_time
   - event_name
   - tipology
   

   **Required:**
 
   - `prenotation_day=[date]` 
   - `id_room=[integer]`
   - `id_user=[string]`
   - `prenotation_time=[date]`
   - `event_name=[string]`
   - `tipology=[integer]`

   **Optional:**
 
 	null

* **Data Params**

   |  Key     | Value   |
   |----------|:-------:|
   |`prenotation_day`|11-05-2019|
   |`id_room`  | 5       |
   |`id_user`    | foo     |
   |`prenotation_time`	|current_date	|
   |`event_name`|conferenza_informatica	|
   |`tipology`|2|
   
* **Success Response:**
  ```javascript
  {
	
  	"id": "5cadf6ff786dhfgy847rt",
	"prenotation_day": "2000-11-04T23:00:00.000Z",
	"id_room": "ds2uh4",
	"id_user": "v33f2w",
	"event_name": "conferenza_informatica",
	"tipology": "conferenza",
	"__v": 0,
	"prenotation_time": "2019-04-10T14:00:25.177Z"
  }
  ```

 
* **Error Response:**
   ```javascript
  {
	"status": 0,
	"message": "roomid not found"
  }
  ```
 
 
**Ricerca di tutte le aule**

  `/api/getallRoom`
  

* **Method:**

  `GET`  
  
*  **URL Params**

	null


   **Required:**
 
   	null

   **Optional:**
 
 	null

* **Data Params**

	null
	
* **Success Response:**
  ```javascript
  {
	"name": "auditorium",
   	"posti": 200,
   	"tipo": "conferenze",
   	"lim": false,
   	"proiettore": true,
   	"ncomputer": 20
  
  }
  ```

 
* **Error Response:**
   ```javascript
  {
	"status": 0,
	"message": "no room found"
  }
  ```
 
 
**Ricerca di tutte le prenotazioni**

  `/api/getallPrenotation`
  

* **Method:**

  `GET`  
  
*  **URL Params**

	null


   **Required:**
 
   	null

   **Optional:**
 
 	null

* **Data Params**

	null
	
* **Success Response:**
  ```javascript
  {
  	"id": "5cadf6ff786dhfgy847rt",
	"prenotation_day": "2000-11-04T23:00:00.000Z",
	"id_room": "ds2uh4",
	"id_user": "v33f2w",
	"event_name": "conferenza_informatica",
	"tipology": "conferenza",
	"__v": 0,
	"prenotation_time": "2019-04-10T14:00:25.177Z"
  
  }
  ```

 
* **Error Response:**
   ```javascript
  {
	"status": 0,
	"message": "no prenotation found"
  }
  ```

**Ricerca di tutti gli utenti**

  `/api/getallUser`
  

* **Method:**

  `GET`  
  
*  **URL Params**

	null


   **Required:**
 
   	null

   **Optional:**
 
 	null

* **Data Params**

	null
	
* **Success Response:**
  ```javascript
  {
  	"username": "GinoPaoli33",
	"password": "GPCiao23*",
	"name": "Gino",
	"surname": "Paoli",
  	"category": "normal",
	"access_lavel": "1"
  }
  ```

 
* **Error Response:**
   ```javascript
  {
	"status": 0,
	"message": "no users found"
  }
  ```

**Aggiungi aula**

  `/api/addAula`
  

* **Method:**

  `POST
  
*  **URL Params**

	- name 
   	- posti 
   	- tipo
	- lim
	- proiettore
	- ncomputer
  
   **Required:**
 
   	- `name=[string]`
  	- `posti=[integer]`
   	- `tipo=[string]`
	

   **Optional:**
 
   	- `lim=[boolean]`
	- `proiettore=[boolean]`
	- `ncomputer=[integer]`

* **Data Params**

	|  Key     | Value   |
   	|----------|:-------:|
   	|`name`  | auditorium       |
   	|`posti`    |200     |
   	|`tipo`	|2|
	|`lim`	|false|
	|`proiettore` |true	|
	|`ncomputer`	|20	|
	
* **Success Response:**
  ```javascript
  {
  	"id": "dhf492"
  	"name": "auditorium",
	"posti": 200,
	"tipo": 2,
	"lim": false,
  	"proiettore": true,
	"ncomputer": "20"
  }
  ```

