Firestore :- 

1} TimeSheet --> 
 
userid: {
    Day,
    Date,
    Type,
    Leave Email (Image Path/Url),
    Start Time,
    Finish Time,
    Description,
    userId,
    name,
    email
    Status (in-progress, approve, reject)
}

2} Personnel Info -->

userId: {
    name,
    email,
    phone,
}

3} Storage(file) -->

name(folder) userid  -->  dateTimeStamp imagepath

Note:- For each user, there is a folder for that, 
        which getting used to segregate each user data, while fetching out its detail from the firestore.

