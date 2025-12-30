# project-wtm
You can check the site here - https://project-wtm.vercel.app (hosted via Vercel, Render and Supabase) - use testadmin@test.admin admin123 (backend takes a while to boot up so might have to try a few times)
[English version below](#english) </br>
Projekt przedstawia pracę dyplomową, której zadaniem jest stworzenie aplikacji internetowej upraszczającej ewidencje czasu pracy i organizacji w firmie.

### Baza danych  
Serwer bazy danych aplikacji został postawiony na  PostgreSQL. Stworzona baza danych łączy się backend'em aplikacji i tam tworzone są encję oraz odpowiednie zapytania.  

### Backend  
Backend został stworzony na środowisku node.js używając framework'u NestJS. Korzystając z technologii TypeORM backend łączy się z bazą danych i tworzy odpowiednie encje z kolumnami oraz połączeniami tabel.

#### Łączenie z bazą  
![image](https://user-images.githubusercontent.com/92587389/223803677-dd78c3a8-01cf-4c22-98f2-cd1ab4dd1fd2.png)  

W process.env znajdują się odpowiednie dane do połączenia z serwerem PostgreSQL, takie jak hasło i nazwa bazy.  

#### Tworzenie encji  

![image](https://user-images.githubusercontent.com/92587389/223803950-31887bfb-1e36-4ddc-b397-78ce6348dd4a.png)  

Każda encja jest tworzona w taki sam sposób, dodanie znacznika @Entity('nazwa encji') oznacza tworzenie nowej encji w środku dawane są wszystkie kolumny i połączenia tabeli, w tym przypadku mamy @PrimaryGeneratedColumn, czyli automatycznie nadawane kolejne id rekordom,  zwykłą kolumnę typu string, kolumnę @CreatedDateColumn, która przy nie podaniu danej daty wpiszę datę stworzenia rekordu, kolumnę typu number, z opcją nullable, czyli z możliwością wpisania wartości null, tabele created i edited at, czyli tabelę z datą stworzenia rekordu i ostatniej edycji oraz kolumnę klucza obcego user_id_fk, który łączy się połączeniem wiele do jednego z tabelą user_info.  


Gdy mamy już wszystkie encje następnym krokiem jest stworzenie odpowiednich funkcji i kontrolerów, które będą wystawiać endpointy API, aby użytkownicy mogli pobierać i wysyłać odpowiednie dane.  

#### Funkcja
![image](https://user-images.githubusercontent.com/92587389/223805180-2159c96f-926c-43ef-abe3-beba509684c0.png)  

Pokazana powyżej funkcja ma za zadanie znaleźienie użytkownika po otrzymanym adresie email. TypeORM pozwala na tworzenie zapytań SQL w prosty sposób, tak jak można zobaczyć w polu select wpisuje interesujące mnie pola, w where daje warunek jakie dane mają się pokazać, gdyby były to dane powiązane relacją to wystarczyłoby dodać pod where pole relations w które wpisano by pole które jest powiązane.  
Observable<User> oznacza że funkcja będzie oczekiwać zwrotu wartości jednego User'a, gdyby wpisane było User[] mogło to by być wielu userów.  
#### Kontroler  
![image](https://user-images.githubusercontent.com/92587389/223806841-9a16a061-bba8-425e-aea3-afa3b7e5f942.png)  

Kontroler jest dużo prostszy na początku zaznaczymy do jakiego żądania i na jaki adres będzie przypisany kontroler, w tym wypadku żądanie GET na adres /user/email/:email, gdzie ':email' oznacza wpisany parametr, który później jest wysyłany do wcześniejszej funkcji.  

#### Guardy  

Każdy endpoint jest chroniony przez guardy, czyli autoryzację, zalogowany użytkownik ma przypisany token, który jest wysyłany z każdym żądaniem i guardy sprawdzają czy token ma przypisaną rolę 'USER' czy 'ADMIN' i na tej podstawie przyznają dostęp do API.  

### Frontend  

Frontend został stworzony wykorzystując biblioteki React, oraz gotowe style Bootstrap. 

#### Logowanie  

![image](https://user-images.githubusercontent.com/92587389/223807815-487700ff-51f1-4a12-b52d-390cb56cdae1.png)  

Po podaniu adresu email i hasła wysyłane jest żądanie, przy poprawnych danych użytkownikowi dawany jest token JWT mając ważność jednego dni.  

#### Profil zwykłego użytkownika  

![image](https://user-images.githubusercontent.com/92587389/223808506-6a980247-43af-41b1-a24b-5b59332e29c6.png)  

Logując się na zwyklego użytkownika pokazuję się ekran jego profilu, może tu zobaczyć swoje informacje, dni zdalne i czasy pracy oraz je dodać, edytować czy usunąć.  

#### Dodanie czasu pracy  
![image](https://user-images.githubusercontent.com/92587389/223808913-74841ecd-4b78-47d9-9995-04e4f352e985.png)  
![image](https://user-images.githubusercontent.com/92587389/223809025-e858f66b-921b-4a15-9738-9150781adbfb.png)  

Użytkownik może dodać tylko czas na dzisiejszy dzień, po dodaniu statusu końca pracy w backendz'ie obliczany jest przepracowany czas i później na froncie jest on pokazywany jeśli jest jakiś.  

![image](https://user-images.githubusercontent.com/92587389/223809513-99772eda-6b0e-4019-ad6e-230bca29ebda.png)  

#### Admin  

Konto admin'a ma dużo więcej opcji po zalogowaniu pokazuję mu się ekran dyżurów, może również wejść w zakładki użytkownicy, zespoły, dni zdalne i czasy pracy. Każdą opcję admin może przeglądać, edytować, dodawać oraz usuwać.  

![image](https://user-images.githubusercontent.com/92587389/223810014-ecf41f26-74cd-434b-a4cb-a313887accf8.png)

Po kliknięciu na dany dzień pokazuję się informacja czy jakiś zespół jest do niego przypisany.  

![image](https://user-images.githubusercontent.com/92587389/223810552-a3fd9dd2-f6c1-4723-afd1-e80fa76e63aa.png)  

W zakładce użytkownicy znajduję się lista użytkowników.  

![image](https://user-images.githubusercontent.com/92587389/223811426-ce447a58-31ba-4c93-9210-9d39b2024a47.png)  

W zakładce zespoły mamy listę zespołów.  

![image](https://user-images.githubusercontent.com/92587389/223811615-3310a901-9f4c-4c26-9e67-807f0c5c1742.png)  

W zakładce dni zdalne mamy listę dni zdalnych danego użytkownika.  

![image](https://user-images.githubusercontent.com/92587389/223811953-b3a9c945-beba-4ba0-a5de-1dcddada62b7.png)  

W zakładce czasy pracy znajdują się wiadomości o statusach pracy danego pracownika oraz obliczony przepracowany czas w danym okresie.  

<h3 id="english">English</h3>
The project presents a web application that simplifies the recording of working time and organization in a company.

### Database
Serwer bazy danych aplikacji został postawiony na  PostgreSQL. Stworzona baza danych łączy się backend'em aplikacji i tam tworzone są encję oraz odpowiednie zapytania.  

### Backend  
The application's database server was built on PostgreSQL. The created database connects to the application's backend, where entities and appropriate queries are created.

#### Connecting to the database  
![image](https://user-images.githubusercontent.com/92587389/223803677-dd78c3a8-01cf-4c22-98f2-cd1ab4dd1fd2.png)  

process.env contains the appropriate data for connecting to the PostgreSQL server, such as the password and database name.

#### Creating Entity  

![image](https://user-images.githubusercontent.com/92587389/223803950-31887bfb-1e36-4ddc-b397-78ce6348dd4a.png)  

Each entity is created in the same way, adding the @Entity('entity name') tag means creating a new entity inside, all columns and table connections are given, in this case we have @PrimaryGeneratedColumn, which automatically assigns subsequent ids to records, a regular string column, @CreatedDateColumn column, which if a given date is not provided, will enter the date of record creation, a number column, with the nullable option, i.e. with the possibility of entering a null value, created and edited at tables, i.e. a table with the date of record creation and last edit, and a foreign key column user_id_fk, which connects with a many-to-one connection to the user_info table.


Once we have all the entities, the next step is to create the appropriate functions and controllers that will expose API endpoints so that users can retrieve and send the appropriate data.

#### Function
![image](https://user-images.githubusercontent.com/92587389/223805180-2159c96f-926c-43ef-abe3-beba509684c0.png)  

The function shown above is designed to find a user by providing an email address. TypeORM allows you to create SQL queries in a simple way. As you can see, the select field specifies the fields of interest. The where field specifies the condition for displaying the data. If the data were related by a relationship, it would be sufficient to add a relations field under the where field, which would contain the related field. Observable<User> means that the function will expect the value of a single User to be returned. If User[] were entered, it could return multiple users.
#### Controller  
![image](https://user-images.githubusercontent.com/92587389/223806841-9a16a061-bba8-425e-aea3-afa3b7e5f942.png)  

The controller is much simpler, at the beginning we will mark to what request and to what address the controller will be assigned, in this case a GET request to the address /user/email/:email, where ':email' stands for the entered parameter, which is later sent to the previous function.

#### Guards

Each endpoint is protected by guards, i.e. authorization, the logged in user is assigned a token that is sent with each request and the guards check whether the token has been assigned the 'USER' or 'ADMIN' role and based on this they grant access to the API.

### Frontend  

The frontend was created using React libraries and ready-made Bootstrap styles.

#### Logging  

![image](https://user-images.githubusercontent.com/92587389/223807815-487700ff-51f1-4a12-b52d-390cb56cdae1.png)  

After entering the email address and password, a request is sent, and if the data is correct, the user is given a JWT token valid for one day.

#### Normal User

![image](https://user-images.githubusercontent.com/92587389/223808506-6a980247-43af-41b1-a24b-5b59332e29c6.png)  


When logging in as a regular user, their profile screen appears, where they can see their information, remote days and working times, and add, edit or delete them.

#### Adding Work Time   
![image](https://user-images.githubusercontent.com/92587389/223808913-74841ecd-4b78-47d9-9995-04e4f352e985.png)  
![image](https://user-images.githubusercontent.com/92587389/223809025-e858f66b-921b-4a15-9738-9150781adbfb.png)  

The user can only add time for today, after adding the end of work status, the time worked is calculated in the backend and later on the frontend it is shown if there is any.

![image](https://user-images.githubusercontent.com/92587389/223809513-99772eda-6b0e-4019-ad6e-230bca29ebda.png)  

#### Admin  

The admin account has many more options. After logging in, they are presented with a shifts screen and can also access the user, team, remote days, and work hours tabs. Each option can be viewed, edited, added, or deleted by the admin.

![image](https://user-images.githubusercontent.com/92587389/223810014-ecf41f26-74cd-434b-a4cb-a313887accf8.png)

After clicking on a given day, information appears as to whether any team is assigned to it.

![image](https://user-images.githubusercontent.com/92587389/223810552-a3fd9dd2-f6c1-4723-afd1-e80fa76e63aa.png)  

In the users tab there is a list of users.

![image](https://user-images.githubusercontent.com/92587389/223811426-ce447a58-31ba-4c93-9210-9d39b2024a47.png)  

In the teams tab we have a list of teams.

![image](https://user-images.githubusercontent.com/92587389/223811615-3310a901-9f4c-4c26-9e67-807f0c5c1742.png)  

In the remote days tab we have a list of remote days for a given user.

![image](https://user-images.githubusercontent.com/92587389/223811953-b3a9c945-beba-4ba0-a5de-1dcddada62b7.png)  

The working times tab contains information about the work status of a given employee and the calculated time worked in a given period.
