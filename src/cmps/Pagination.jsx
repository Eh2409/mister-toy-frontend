import { Fragment } from 'react'

export function Pagination({ maxPageCount, pageIdx, setPageIdx }) {

    const pages = setPageBtns(maxPageCount, pageIdx)

    function setPageBtns(maxPage, currPage) {
        var btnsCount = new Set([0, currPage])

        if (maxPage) btnsCount.add(maxPage - 1)

        if (currPage > 0) btnsCount.add(currPage - 1)
        if (currPage < maxPage - 1) btnsCount.add(currPage + 1)

        btnsCount = Array.from(btnsCount)
        btnsCount = btnsCount.sort((n1, n2) => (n1 - n2) * 1)

        return btnsCount
    }

    function onSetPageIdx(pageIdx) {
        setPageIdx(pageIdx)
    }

    function onSetPageBydiff(diff) {
        const nextPage = pageIdx + diff
        if (nextPage < 0 || nextPage > maxPageCount - 1) return
        setPageIdx(nextPage)
    }

    function isGap(pages, idx, pageNum) {
        const prevPage = pages[idx - 1]
        const isGap = prevPage !== undefined && pageNum - prevPage > 1
        return isGap
    }

    return (
        <section className="pagination">
            <button disabled={pageIdx <= 0} onClick={() => { onSetPageBydiff(-1) }}>Prev</button>

            {maxPageCount > 0 &&
                pages.map((pageNum, idx) => {
                    return <Fragment key={pageNum}>
                        {isGap(pages, idx, pageNum) && <button className="gap" disabled={true}>...</button>}
                        <button className={pageIdx === pageNum ? "active" : ""}
                            onClick={() => { onSetPageIdx(pageNum) }}>
                            {pageNum + 1}
                        </button>
                    </Fragment>

                })
            }

            <button disabled={pageIdx >= maxPageCount - 1} onClick={() => { onSetPageBydiff(1) }}>Next</button>
        </section>
    )
}