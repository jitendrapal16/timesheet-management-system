# Firebase and PWA
**Time-Sheet Management System** is a *Web App*, which using **`Node.js`** *Tech stack* with the following concepts :
- Firebase for `Authentication`, `Database`, `Storage` and `Hosting`
- PWA for `caching`, `notification` and *platform independent* `Installation`
    > :warning: **Note**: PWA stands for [Progressive Web App](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)

Application is been Hosted on Firebase using `Authentication`, `Firestore` and `Storage` with **PWA** *enabled* for `Caching`, `Push Notification` and `Installable` featrure

## Usage
There will be two types of user: **Employee** and **Manager** 

*Employees can perform following:* 
- **Login** 
- **Fill Time sheet** : 
    - Time sheet can be of 2 types, `work hours` and `leave day`. *In case of leave day you 
need to upload leave email*. 
    - Time sheet will expect `Type`, `Date`, `Start-time`, `end-time` and `description`. 
- **View Time sheet** with the status (`Inprocess`, `Approve`/`Reject`). 
- **Sign up** using `username/password`, `gmail`, `phone-number`. 

*Manager can perform following:* 
- **Login** 
- **View** the time sheet data
- **Approve / Reject** timesheet

## Implementation Concepts
*Firebase:* 
- Maintain `Database` in firebase. You can choose db from `Realtime DB`/`Firestore`. 
- Maintain `file storage` in firebase 
- Apply appropriate `Security rules` on **Database** and **Storage** 
    - Firestore (Database)
        > - Only the authenticated user can `read` and `write` the data
    - Storage (Object)
        > - Only the current user can `write` the data
        > - Only the authenticated user can `read` the data
- Manage `authentication` in Firebase 
- `Host` the application in firebase

*PWA:* 
- Web App should be `Installable`. 
- Web App should show `notification` to manager when employee fill timesheet. 
- Web App should show `notification` to employee when manager takes action on timesheet. 
- All the static resources should be `cached`. 


### Important Points.
1. Screenshots have been attached for each steps
2. code is attached, which can start working, after putting the creds and Run the command:
- *npm run build* with live server
3. Employee TimeSheet will be filled by weekly and can be viewed for *5 WEEKS* and can get the status for that
4. Manager can get the timesheet for Individual user(Employee) for last *5 WEEKS* and can take the action according to it.
5. The Leave Email Image will store in Firebase Storage and the url will in Firestore with Strong Security Rules.

### Usage

- **Clone** the Repository
    ```bash 
    git clone https://github.com/jitendrapal16/timesheet-management-system.git
    cd timesheet-management-system/
    ```
- **Install** the dependencies
    ```node 
    npm install
    ```
- **Run** the project via `live server` *(Install the live server extension in visual code)*
    - right click on **`index.html`** inside `dist/`
    - click on **`Run with Live Server`**
- **build** the project using `webpack`
    ```node 
    npm run build
    ```

### Host the Web-App on Firebase
To Host the app on firebase follow the below steps :
- Setup the configuration before hosting
- Execute the command to deploy
    ```bash
    firebase login
    firebase init
    firebase deploy
    ```
