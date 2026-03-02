#!/usr/bin/env python3
"""
ActProof Demo - CC Time Series Visualization
Generates a simple ASCII chart or CSV for external plotting.

Usage:
  python3 plot_cc.py evidence/cc_timeseries.json
  python3 plot_cc.py evidence/cc_timeseries.json --csv > cc_data.csv
"""

import json
import sys
from datetime import datetime

def load_data(filepath):
    with open(filepath, 'r') as f:
        return json.load(f)

def ascii_chart(data, width=60, height=15):
    """Generate ASCII chart of CC over time"""
    if not data:
        print("No data to plot")
        return

    cc_values = [d['cc'] for d in data]
    timestamps = [d['timestamp'] for d in data]
    variants = [d.get('variant', '?') for d in data]

    min_cc = min(cc_values)
    max_cc = max(cc_values)
    cc_range = max_cc - min_cc if max_cc != min_cc else 1

    # Sample data if too many points
    step = max(1, len(data) // width)
    sampled = data[::step]

    print(f"\nActProof CC Time Series")
    print(f"{'=' * 50}")
    print(f"Points: {len(data)} | Min CC: {min_cc:.2f} | Max CC: {max_cc:.2f}")
    print()

    # ASCII plot
    for row in range(height, -1, -1):
        threshold = min_cc + (cc_range * row / height)
        line = f"{threshold:6.1f} |"
        
        for d in sampled:
            cc = d['cc']
            normalized = (cc - min_cc) / cc_range * height
            if abs(normalized - row) < 0.5:
                variant = d.get('variant', '?')
                char = 'H' if variant == 'heavy' else 'L' if variant == 'light' else '*'
                line += char
            else:
                line += ' '
        
        print(line)

    print(f"       +{'-' * len(sampled)}")
    print(f"        Time -->")
    print()
    print("Legend: H=heavy, L=light")

def to_csv(data):
    """Output CSV format for external plotting"""
    print("timestamp,cc,variant,datetime")
    for d in data:
        ts = d['timestamp']
        dt = datetime.fromtimestamp(ts/1000).isoformat() if ts > 1e10 else datetime.fromtimestamp(ts).isoformat()
        print(f"{ts},{d['cc']:.4f},{d.get('variant', 'unknown')},{dt}")

def main():
    if len(sys.argv) < 2:
        print("Usage: python3 plot_cc.py <cc_timeseries.json> [--csv]")
        sys.exit(1)

    filepath = sys.argv[1]
    csv_mode = '--csv' in sys.argv

    data = load_data(filepath)

    if csv_mode:
        to_csv(data)
    else:
        ascii_chart(data)

        # Summary stats
        if data:
            heavy_cc = [d['cc'] for d in data if d.get('variant') == 'heavy']
            light_cc = [d['cc'] for d in data if d.get('variant') == 'light']

            print("\nSummary:")
            if heavy_cc:
                print(f"  Heavy variant: avg CC = {sum(heavy_cc)/len(heavy_cc):.2f} ({len(heavy_cc)} samples)")
            if light_cc:
                print(f"  Light variant: avg CC = {sum(light_cc)/len(light_cc):.2f} ({len(light_cc)} samples)")

if __name__ == '__main__':
    main()
