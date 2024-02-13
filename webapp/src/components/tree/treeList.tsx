// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.
import React from 'react'

import {Board, IPropertyTemplate} from '../../blocks/board'
import {Card} from '../../blocks/card'

import './treeList.scss'

import {IDType, Utils} from '../../utils'

import TreeCard from './treeCard'
import CardsAdjacencyList from './cardsAdjacencyList'

type Props = {
    board: Board
    cards: Card[]
    matrix: CardsAdjacencyList
    card: Card
    visited: string[]
    root?: boolean
    onClick?: (e: React.MouseEvent, card: Card) => void
    onDrop?: (srcCard: Card, dstCard: Card) => void
    showCard?: (cardId?: string) => void
    visibleBadges: boolean
    visiblePropertyTemplates: IPropertyTemplate[]
    readonly: boolean

}

const TreeList = (props: Props): JSX.Element => {
    const {
        board,
        cards,
        matrix,
        card,
        visited,
        root,
        showCard,
        onClick,
        onDrop,
        visibleBadges,
        visiblePropertyTemplates,
        readonly,
    } = props

    const cardId = card.id
    const selfVisited = visited.includes(cardId)
    const classname: string = root ? 'TreeList TreeListRoot' : 'TreeList'

    if (!visited.includes(cardId)) {
        visited.push(cardId)
    }
    const children = matrix.getChildren(cardId).filter((c) => !visited.includes(c.id))

    return (
        <>
            {(selfVisited || card === undefined) ? <></> : <ul className={classname}>
                <li>
                    <TreeCard
                        key={card.id}
                        board={board}
                        card={card}
                        visiblePropertyTemplates={visiblePropertyTemplates}
                        isSelected={false}
                        visibleBadges={visibleBadges}
                        readonly={readonly}
                        onClick={onClick}
                        onDrop={onDrop}
                        showCard={showCard}
                        isManualSort={true}
                        visited={visited}
                    />

                    {children.map((n: Card) => {
                        return (<TreeList
                            key={Utils.createGuid(IDType.None)}
                            board={board}
                            cards={cards}
                            matrix={matrix}
                            card={n}
                            visited={visited}
                            root={false}
                            onClick={onClick}
                            onDrop={onDrop}
                            showCard={showCard}
                            visibleBadges={visibleBadges}
                            visiblePropertyTemplates={visiblePropertyTemplates}
                            readonly={readonly}
                                />)
                    },
                    )
                    }
                </li>
            </ul>
            }

        </>

    )
}

export default TreeList
