import { Client, Databases, ID, Query } from 'appwrite';

// import appwrite ids from .env.local
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

//we have to get access appwrite functionalities , for that we need to create appwrite client 
//setting endpoint as tmdb 
// This is setting up your Appwrite client so you can connect to your Appwrite backend from your frontend app.
const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(PROJECT_ID);

//telling which functionalities we want to use from appwrite : database functionalities 
const database = new Databases(client);

//update search count for trending movies
export const updateSearchCount = async (searchTerm, movie) => {
  //1.use appwite sdk to check if the search term exists in the database

  if (!searchTerm || searchTerm.trim() === '') return;

  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('searchTerm', searchTerm),
    ]);

      //2. if it does , update the count 
    if (result.documents.length > 0) {
      const doc = result.documents[0];
      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1,
      });
    } 
    
    // 3. if it doesnot , create a new document with the search term and count as 1
    else {
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie?.id || null,
        poster_url: movie?.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : '',
      });
    }
  } catch (error) {
    console.error('Appwrite updateSearchCount error:', error);
  }
};

//getting trending movie list 
export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc('count'),
    ]);

    return result.documents;
  } catch (error) {
    console.error('Appwrite getTrendingMovies error:', error);
    return [];
  }
};
