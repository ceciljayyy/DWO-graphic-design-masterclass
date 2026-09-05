import { CHART_COLORS, type AnalyticsPoint } from '@/Components/Admin/analyticsTypes';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type Props = {
    series: AnalyticsPoint[];
};

type TooltipPayloadItem = {
    dataKey?: string | number;
    value?: number;
    color?: string;
    name?: string;
};

function ChartTooltip({
    active,
    payload,
    label,
}: {
    active?: boolean;
    payload?: TooltipPayloadItem[];
    label?: string;
}) {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0] as TooltipPayloadItem & { payload?: AnalyticsPoint };
    const fullLabel = point.payload?.fullLabel ?? label;

    return (
        <div className="rounded-lg border border-zinc-700 bg-zinc-950 px-3.5 py-3 text-xs text-zinc-100 shadow-xl">
            <p className="mb-2 font-medium text-white">{fullLabel}</p>
            <dl className="space-y-1.5">
                {payload.map((item) => (
                    <div key={String(item.dataKey)} className="flex items-center justify-between gap-6">
                        <dt className="flex items-center gap-2 text-zinc-300">
                            <span
                                className="inline-block h-2 w-2 rounded-full"
                                style={{ backgroundColor: item.color }}
                            />
                            {item.name}
                        </dt>
                        <dd className="font-medium tabular-nums text-white">{item.value ?? 0}</dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}

export default function RegistrationAnalyticsChart({ series }: Props) {
    return (
        <div className="h-[240px] w-full sm:h-[320px] xl:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                    <defs>
                        <linearGradient id="fillRegistrations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={CHART_COLORS.registrations} stopOpacity={0.22} />
                            <stop offset="100%" stopColor={CHART_COLORS.registrations} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fillPaid" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={CHART_COLORS.paid} stopOpacity={0.2} />
                            <stop offset="100%" stopColor={CHART_COLORS.paid} stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#27272a" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                        dataKey="label"
                        tick={{ fill: '#a1a1aa', fontSize: 11 }}
                        tickLine={false}
                        axisLine={{ stroke: '#3f3f46' }}
                        minTickGap={28}
                    />
                    <YAxis
                        allowDecimals={false}
                        tick={{ fill: '#a1a1aa', fontSize: 11 }}
                        tickLine={false}
                        axisLine={false}
                        width={36}
                    />
                    <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#71717a', strokeDasharray: '4 4' }} />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        wrapperStyle={{ fontSize: 12, color: '#d4d4d8', paddingTop: 8 }}
                    />
                    <Area
                        type="monotone"
                        dataKey="registrations"
                        name="Registrations"
                        stroke={CHART_COLORS.registrations}
                        fill="url(#fillRegistrations)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        isAnimationActive={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="paid"
                        name="Paid"
                        stroke={CHART_COLORS.paid}
                        fill="url(#fillPaid)"
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4 }}
                        isAnimationActive={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="pending"
                        name="Pending"
                        stroke={CHART_COLORS.pending}
                        fill="transparent"
                        strokeWidth={1.75}
                        strokeDasharray="4 3"
                        dot={false}
                        activeDot={{ r: 3 }}
                        isAnimationActive={false}
                    />
                    <Area
                        type="monotone"
                        dataKey="failed"
                        name="Failed"
                        stroke={CHART_COLORS.failed}
                        fill="transparent"
                        strokeWidth={1.75}
                        dot={false}
                        activeDot={{ r: 3 }}
                        isAnimationActive={false}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
