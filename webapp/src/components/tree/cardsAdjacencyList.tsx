import { Card } from "../../blocks/card";

class CardsAdjacencyList {
    matrix: { [p: string]: Card[] } = {};

    constructor(cards: Card[]) {
        this.loadCards(cards);
    }

    private loadCards(cards: Card[]): void {
        this.matrix = {};
        for (const card of cards) {
            if (this.matrix[card.id] == null) {
                this.matrix[card.id] = [];
            }
            if (this.matrix[card.parentId] == null) {
                this.matrix[card.parentId] = [];
            }
            this.matrix[card.parentId].push(card);
        }
    }

    public getChildren(cardId: string): Card[] {
        if (this.matrix[cardId] == null) {
            return [];
        }
        return this.matrix[cardId];
    }

    public getCardIds(): string[] {
        return Object.keys(this.matrix);
    }

}


export default CardsAdjacencyList;
