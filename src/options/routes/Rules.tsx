import _ from "lodash"
import { useEffect, useMemo, useState } from "react"

import { sendToBackground } from "@plasmohq/messaging"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/lib/components/Accordion"
import { Card, CardContent, CardFooter } from "~/lib/components/Card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/lib/components/Pagination"
import report from "~/lib/report"
import { getRulesCount, parseRules } from "~/lib/rules"
import type { Rules as IRules } from "~/lib/types"

function RulesPagination({
  currentPage,
  setCurrentPage,
  pageSize,
  itemsCount,
}: {
  currentPage: number
  setCurrentPage: (page: number) => void
  pageSize: number
  itemsCount: number
}) {
  const totalPage = Math.ceil(itemsCount / pageSize)
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />
        </PaginationItem>
        {Array.from({ length: totalPage }).map((_, index) => {
          const page = index + 1
          if (
            page === 1 ||
            page === totalPage ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <PaginationItem key={page}>
                <PaginationLink
                  isActive={page === currentPage}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            )
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <PaginationItem key={page}>
                <PaginationEllipsis />
              </PaginationItem>
            )
          }
        })}
        <PaginationItem>
          <PaginationNext
            disabled={currentPage >= totalPage}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

function RulesList({
  rules,
  start,
  end,
}: {
  rules: IRules
  start: number
  end: number
}) {
  const rulesKeys = useMemo(() => Object.keys(rules), [rules])

  return rulesKeys.slice(start, end).map((key) => {
    const rule = rules[key]
    return (
      <div key={key}>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="font-medium">
                {rule._name} - {key}
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2">
                {Object.keys(rule).map((item) => {
                  const subdomainRules = rule[item]
                  if (Array.isArray(subdomainRules)) {
                    return subdomainRules.map((subdomainRule, index) => {
                      return (
                        <div key={key + item + index}>
                          <div className="flex items-center space-x-2">
                            <div className="flex-1">
                              <p className="text-sm text-foreground/70">
                                {subdomainRule.title}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  } else {
                    return null
                  }
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    )
  })
}

const pageSize = 20

function Rules() {
  const [rules, setRules] = useState<IRules>({})
  const rulesCount = useMemo(() => getRulesCount(rules), [rules])

  const [currentPage, setCurrentPage] = useState(1)
  const itemsCount = useMemo(() => Object.keys(rules).length, [rules])

  useEffect(() => {
    sendToBackground({
      name: "requestDisplayedRules",
    }).then((res) => setRules(parseRules(res, true)))
    report({
      name: "options-rules",
    })
  }, [])

  return (
    <div>
      <h1 className="text-3xl font-medium leading-10 mb-6 text-primary border-b pb-4">
        {chrome.i18n.getMessage("rules")}
      </h1>
      <div className="content mb-6 space-y-2">
        <p>
          {chrome.i18n.getMessage("totalNumberOfRules")}: {rulesCount}
        </p>
        <p
          dangerouslySetInnerHTML={{
            __html: chrome.i18n.getMessage("forMoreRulesJoinUs"),
          }}
        ></p>
      </div>
      <div className="space-y-4">
        <Card>
          <CardContent>
            <RulesList
              rules={rules}
              start={(currentPage - 1) * pageSize}
              end={currentPage * pageSize}
            />
          </CardContent>
          <CardFooter>
            <RulesPagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageSize={pageSize}
              itemsCount={itemsCount}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export { Rules }
