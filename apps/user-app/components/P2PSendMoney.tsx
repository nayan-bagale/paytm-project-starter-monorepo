'use client'
import { Button } from "@repo/ui/button"
import { Card } from "@repo/ui/card"
import { TextInput } from "@repo/ui/textinput"
import { useState } from "react"
import { p2pSendMoney } from "../lib/action/p2pSendMoney"

const P2PSendMoney = () => {
    const [number, setNumber] = useState("");
    const [amount, setAmount] = useState("");
  return (
      <Card title="P2P Transfer">
          <div className="w-full">
              <TextInput label={"Number"} placeholder={"Number"} onChange={(number) => {
                  setNumber(number)
              }} />
              <TextInput label={"Amount"} placeholder={"Amount"} onChange={(amount) => {
                  setAmount(amount)
              }} />
              <div className="flex justify-center pt-4">
                  <Button onClick={async () => {
                     const res = await p2pSendMoney(number, (Number(amount) * 100).toString());
                     console.log(res)
                  }}>
                      Send Money
                  </Button>
              </div>
          </div>
      </Card>
  )
}

export default P2PSendMoney