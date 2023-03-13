# project-wtm
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
