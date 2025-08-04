// environment.prod.ts
// Production environment configuration
// step 1: ng build --configuration production
// step 2: npm run build ou
// step 3: npx serve -s dist/gestiona-app/browser -p 3000


export const environment = {
  production: true,
  apiUrl: 'http://backend:8080/'
  //apiUrl: 'http://localhost:8080/'
};
