import { getServerSession } from "next-auth/next";
import P2PSendMoney from "../../../components/P2PSendMoney"
import prisma from "@repo/db/client";
import { authOptions } from "../../../lib/auth";
import { P2PTransaction } from "../../../components/P2PTransaction";

const transactions = async () => {
    const session = await getServerSession(authOptions);
    try {
        const fetchtransactions = await prisma.p2PTransaction.findMany({
            where: {
                OR: [
                    { senderId: Number(session?.user?.id) },
                    { receiverId: Number(session?.user?.id) }
                ]
            }
        })

        return fetchtransactions.map( t => {
            if(t.senderId === Number(session?.user?.id)){
                return {
                    status: "Sent",
                    amount: t.amount,
                    receiver: t.receiverId
                }
            }else{
                return {
                    status: "Received",
                    amount: t.amount,
                    sender: t.senderId
                }
            }
        })

    } catch (e) {
        console.log(e)
        return []
    }
}

const page = async () => {
    const transac = await transactions()
    return (
        <div className="w-screen">
            <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
                P2P Transfer
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
                <div>
                    <P2PSendMoney />
                </div>
                <div>
                    {/* <BalanceCard amount={balance.amount} locked={balance.locked} /> */}
                    <div className="pt-4">
                        {/* <OnRampTransactions transactions={transactions} /> */}
                        <P2PTransaction transactions={transac} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page