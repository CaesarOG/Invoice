import { VFS, TimePd } from './models'
import moment from 'moment'

const moVals = new Map<string, { weeks: number, skipEvr: number }>([['Monthly', {weeks: 3, skipEvr: 1}], ['ThreeMonth', {weeks: 12, skipEvr: 2}], 
    ['SixMonth', {weeks: 25, skipEvr: 3}], ['Yearly', {weeks: 51, skipEvr: 4}]])
const monthlies = ['monthlyExpense', 'monthlyPageViews', 'monthlyProfitLoss', 'monthlyRevenue', 'monthlyUniqueUsers']

export default {
    graphify: (logs: VFS[], timePd: TimePd): {logs: VFS[], xticks: number[], xticksFmt: string[], yticks: {[x:string]: number[]} }  => {
        let mt: moment.Moment = moment()
        const mins: {[x:string]: number} = {'monthlyExpense': -999999999, monthlyProfitLoss: -999999999, monthlyRevenue: -999999999}
        const maxs: {[x:string]: number} = {'monthlyExpense': 999999999, monthlyProfitLoss: 999999999, monthlyRevenue: 999999999}
        let year = mt.year()
        let month = mt.month()
        let firstOfMonth = moment([year, month, 1, 0, 0, 0, 0]).utcOffset(-5, true)
        let lastOfMonth = moment(firstOfMonth.valueOf()).add({days: -1, months: 1})
        let xticks: number[] = [lastOfMonth.valueOf()]
        let xticksFmt: string[] = [lastOfMonth.format('ll')]
        let yticks: {[x:string]: number[]} = {}
        
        logs.forEach((val) => {
            val.CreatedAt = moment.parseZone(val.CreatedAt as string).valueOf()
            monthlies.forEach((monthly) => {
                let va = val as {[x:string]: any}
                if(va[monthly] < mins[monthly]) {
                    mins[monthly] = va[monthly] as number
                }
                if(va[monthly] > maxs[monthly]) {
                    maxs[monthly] = va[monthly] as number
                }
    
            });
        });
    
        monthlies.forEach((monthly) => {
            let range = maxs[monthly]-mins[monthly]
            yticks[monthly] = [ Math.round( (mins[monthly]-(range*0.05))/10 )*10, Math.round((mins[monthly])/100)*100, 
                                Math.round( (mins[monthly]+(range/3))/100 )*100, Math.round( (mins[monthly]+(range*(2/3)))/100)*100, 
                                Math.round((maxs[monthly])/100)*100, Math.round((maxs[monthly]+(range*0.05))/10)*10 ]
        });
    
        mt = moment(lastOfMonth.valueOf())
    
        for(let i: number = 0; i < moVals.get(timePd)!.weeks; i++) {
            if((i+1) % moVals.get(timePd)!.skipEvr === 0) {
                mt.subtract(1, "week")
                xticks.unshift(mt.valueOf())
                xticksFmt.unshift(mt.format('ll'))
            }
        }
    
        return { logs, xticks, xticksFmt, yticks }
    },

    defaultTicks: (): { xticks: number[], xticksFmt: string[], yticks: {[x:string]: number[]} }  => {
        let mt: moment.Moment = moment()
        let year = mt.year()
        let month = mt.month()
        let firstOfMonth = moment([year, month, 1, 0, 0, 0, 0]).utcOffset(-5, true)
        let lastOfMonth = moment(firstOfMonth.valueOf()).add({days: -1, months: 1})
        let xticks: number[] = [lastOfMonth.valueOf()]
        let xticksFmt: string[] = [lastOfMonth.format('ll')]
        let yticks: {[x:string]: number[]} = {}
    
        for(let i: number = 0; i < 3; i++) {
            if((i+1) % 1 === 0) {
                mt.subtract(1, "week")
                xticks.unshift(mt.valueOf())
                xticksFmt.unshift(mt.format('ll'))
            }
        }
    
        monthlies.forEach((monthly) => {
            yticks[monthly] = [ 0, 2500, 5000, 7500 ] //[0, 2500, 5000, 7500 ] default y ticks from original dashboard w/ random data
        });
    
        return { xticks, xticksFmt, yticks }
    }
    
}

/* https://x-team.com/blog/automatic-timestamps-with-postgresql/, 
https://stackoverflow.com/questions/38548887/convert-postgres-timestamp-timezone-to-date-object-javascript, 
https://stackoverflow.com/questions/57939639/how-to-convert-a-postgresql-timestamptz-to-a-javascript-date, 
https://stackoverflow.com/questions/42495853/parsing-mysql-date-with-moment, 
https://itnext.io/create-date-from-mysql-datetime-format-in-javascript-912111d57599 
*/