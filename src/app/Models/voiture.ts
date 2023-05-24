

export interface voiture {
    $key:string;
    type:'sedan'|'hatchback'|'supercar' | 'coupe'|'pickup' | 'cabriolet';
    marque: string;
    modele: string;
    puissance: number;
    prix_location: number;
    Categorie: 'essence' | 'diesel';

    
}
