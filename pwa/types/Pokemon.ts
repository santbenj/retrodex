import { Item } from "./item";

export class Pokemon implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public numpokedex?: number,
    public type1?: string,
    public type2?: string,
    public description?: string,
    public images?: string,
    public hp?: number,
    public attack?: number,
    public defense?: number,
    public vitesse?: number,
    public special?: number,
    public poids?: number,
    public taille?: number
  ) {
    this["@id"] = _id;
  }
}
