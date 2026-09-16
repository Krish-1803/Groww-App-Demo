// Explore / "Groww Digest" feed: the standard-surface content tab shown when
// Gen Z mode is OFF (Learn replaces it when the layer is on).

import { useNavigate } from 'react-router-dom'
import { Newspaper, TrendingUp } from 'lucide-react'
import { IndicesStrip } from '../components/IndicesStrip'
import { Card, ComplianceLine, SectionTitle } from '../components/primitives'

const DIGEST = [
  { tag: 'Markets', title: 'Nifty 50 edges higher, led by IT', body: 'Broad indices closed in the green. For long-term SIP investors, a single day is noise.' },
  { tag: 'Mutual Funds', title: 'Why direct plans quietly beat regular ones', body: 'Same fund, lower fee. Over decades the commission you skip compounds in your favour.' },
  { tag: 'IPO', title: '3 issues open this week', body: 'Swiggy is live; NSDL opens soon. Read the RHP risk factors before applying.' },
  { tag: 'Explainer', title: 'What an expense ratio really costs you', body: 'A 1% higher fee for 20 years can shave a big slice off your final corpus.' },
]

export function Explore() {
  const navigate = useNavigate()
  return (
    <div className="space-y-4 px-4 pb-4 pt-2">
      <IndicesStrip />
      <div className="flex items-center gap-2">
        <Newspaper size={20} className="text-teal" />
        <h1 className="text-xl font-extrabold text-ink">Groww Digest</h1>
      </div>

      <Card className="p-4">
        <p className="flex items-center gap-1.5 text-xs font-semibold text-teal"><TrendingUp size={14} /> Top of the day</p>
        <p className="mt-1 text-sm text-ink">
          Markets are calm. If you have an active SIP, you’ve already done the hard part: showing up.
        </p>
      </Card>

      <div>
        <SectionTitle action={<button onClick={() => navigate('/mutual-funds')} className="text-xs font-semibold text-teal">Invest</button>}>
          For you
        </SectionTitle>
        <div className="space-y-3">
          {DIGEST.map((d, i) => (
            <Card key={i} className="p-4">
              <span className="rounded-full bg-canvas px-2 py-0.5 text-[10px] font-semibold text-muted">{d.tag}</span>
              <p className="mt-1.5 font-bold text-ink">{d.title}</p>
              <p className="mt-0.5 text-sm text-muted">{d.body}</p>
            </Card>
          ))}
        </div>
      </div>

      <ComplianceLine />
    </div>
  )
}
