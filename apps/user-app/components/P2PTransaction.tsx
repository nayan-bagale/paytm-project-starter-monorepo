import { Card } from "@repo/ui/card"

export const P2PTransaction = ({
    transactions
}: {
    transactions: {
        amount: number,
        status: string,
        sender?: number,
        receiver?: number,
    }[]
}) => {
    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {transactions.map(t =>{
                if(t.status === "Sent"){
                    return (<div className="flex justify-between">
                        <div>
                            <div className="text-sm">
                                Sent INR
                            </div>
                            <div className="text-slate-600 text-xs">
                                {/* {t.time.toDateString()} */}
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            - Rs {t.amount / 100}
                        </div>
    
                    </div>)
                }
                 return (<div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {/* {t.time.toDateString()} */}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)
        })}
        </div>
    </Card>
}