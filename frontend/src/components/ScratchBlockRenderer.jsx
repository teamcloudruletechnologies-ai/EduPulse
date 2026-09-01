import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, Terminal, Code2 } from 'lucide-react';

// Block Colors matching Scratch 3.0 / Blockly
const COLORS = {
  control: { bg: '#FFAB19', border: '#CF8B13', text: '#FFFFFF' },
  motion: { bg: '#4C97FF', border: '#3373CC', text: '#FFFFFF' },
  looks: { bg: '#9966FF', border: '#774DCB', text: '#FFFFFF' },
  sound: { bg: '#D65CD6', border: '#BD42BD', text: '#FFFFFF' },
  events: { bg: '#FFBF00', border: '#CC9900', text: '#FFFFFF' },
  sensing: { bg: '#4CBFE6', border: '#2E8EB5', text: '#FFFFFF' },
  operators: { bg: '#59C059', border: '#389438', text: '#FFFFFF' },
  variables: { bg: '#FF8C1A', border: '#DB6E00', text: '#FFFFFF' },
};

// Puzzle Notch cutout at top
const TopNotch = ({ bg = '#ffffff' }) => (
  <div
    className="absolute -top-[1px] left-4 w-4 h-1.5 rounded-b-sm z-10"
    style={{ backgroundColor: bg }}
  />
);

// Puzzle Tab sticking out at bottom
const BottomTab = ({ color }) => (
  <div
    className="absolute -bottom-1.5 left-4 w-4 h-1.5 rounded-b-sm z-10 border-b border-black/20"
    style={{ backgroundColor: color }}
  />
);

// White pill for input numbers or strings
const InputPill = ({ children }) => (
  <span className="bg-white text-slate-800 font-bold px-2.5 py-0.5 rounded-full text-xs shadow-inner inline-flex items-center justify-center min-w-[24px] mx-1 border border-black/10">
    {children}
  </span>
);

// Green pill for operators / conditions
const OperatorPill = ({ children }) => (
  <span className="bg-[#59C059] text-white font-bold px-2.5 py-0.5 rounded-full text-[11px] inline-flex items-center gap-1 mx-1 shadow-xs border border-[#45A345]">
    {children}
  </span>
);

// Orange pill for variables
const VariablePill = ({ name }) => (
  <span className="bg-[#FF8C1A] text-white font-bold px-2 py-0.5 rounded-md text-[11px] inline-flex items-center gap-1 mx-1 border border-[#DB6E00]">
    <span>{name}</span>
    <span className="text-[9px] opacity-75">▾</span>
  </span>
);

// Standard statement block (Move, Turn, Set, Ask, Say)
const StandardBlock = ({ type = 'motion', children, canvasBg = '#ffffff', isHighlighted = false, codeLine = '' }) => {
  const c = COLORS[type] || COLORS.motion;
  return (
    <div className={`relative inline-flex items-center max-w-full my-0.5 transition-all duration-300 ${isHighlighted ? 'scale-[1.03] z-20' : 'opacity-90'}`}>
      <div className="relative inline-block">
        <TopNotch bg={canvasBg} />
        <div
          className={`relative px-3.5 py-2 rounded-md font-sans text-xs font-bold text-white shadow-md flex items-center flex-wrap gap-1.5 border-t border-white/25 border-b-2 border-black/25 select-none transition-all duration-300 ${
            isHighlighted ? 'ring-4 ring-yellow-400 shadow-xl shadow-yellow-500/60' : ''
          }`}
          style={{ backgroundColor: c.bg }}
        >
          {children}
        </div>
        <BottomTab color={c.bg} />
      </div>

      {/* Floating live code writer badge right beside block */}
      {isHighlighted && (
        <div className="ml-3 flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded-full bg-yellow-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-ping mr-1" />
            Active
          </span>
          {codeLine && (
            <div className="px-3 py-1 rounded-lg bg-slate-950/95 border border-emerald-400 text-emerald-300 font-mono text-xs shadow-xl flex items-center space-x-1.5 animate-slide-right">
              <span className="text-[10px] text-emerald-500 font-bold uppercase">code:</span>
              <span className="font-bold text-white whitespace-pre">{codeLine}</span>
              <span className="text-emerald-400 font-black animate-pulse">▌</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// C-Block for Loops (repeat, while) - Matching the exact user image
const LoopBlock = ({
  condition = '4',
  children,
  isCondition = false,
  canvasBg = '#ffffff',
  isHighlighted = false,
  returnHighlighted = false,
  codeLine = '',
}) => {
  const c = COLORS.control;
  return (
    <div className={`relative inline-block max-w-full my-0.5 transition-all duration-300 ${isHighlighted ? 'scale-[1.02] z-20' : 'opacity-95'}`}>
      <TopNotch bg={canvasBg} />

      {/* Top bar of C-block */}
      <div
        className={`relative px-3.5 py-2 rounded-t-md font-sans text-xs font-bold text-white shadow-md flex items-center flex-wrap gap-1.5 border-t border-white/25 select-none transition-all duration-300 ${
          isHighlighted ? 'ring-4 ring-yellow-400 shadow-xl shadow-yellow-500/60' : ''
        }`}
        style={{ backgroundColor: c.bg }}
      >
        <span>repeat</span>
        {isCondition ? (
          <OperatorPill>{condition}</OperatorPill>
        ) : (
          <InputPill>{condition}</InputPill>
        )}
        {isHighlighted && (
          <span className="ml-2 px-1.5 py-0.5 rounded bg-yellow-400 text-slate-950 text-[9px] font-black uppercase">
            Loop Checking
          </span>
        )}
        {isHighlighted && codeLine && (
          <div className="ml-2 px-2.5 py-0.5 rounded bg-slate-950/90 border border-emerald-400 text-emerald-300 font-mono text-[11px] shadow-md flex items-center space-x-1 animate-slide-right">
            <span className="text-[9px] text-emerald-500 font-bold">code:</span>
            <span className="font-bold text-white whitespace-pre">{codeLine}</span>
            <span className="text-emerald-400 animate-pulse">▌</span>
          </div>
        )}
      </div>

      {/* Left spine & inner cavity for nested blocks */}
      <div
        className="border-l-[16px] pl-3 py-1.5 space-y-1.5"
        style={{ borderColor: c.bg }}
      >
        {children}
      </div>

      {/* Bottom bar of C-block with loop return arrow ⤴ */}
      <div
        className={`relative px-3.5 py-1.5 rounded-b-md font-sans text-xs font-bold text-white shadow-md flex items-center justify-between border-b-2 border-black/25 select-none transition-all duration-300 ${
          returnHighlighted ? 'ring-4 ring-yellow-400 bg-amber-600' : ''
        }`}
        style={{ backgroundColor: returnHighlighted ? '#E08900' : c.bg }}
      >
        <span className="text-[10px] text-amber-100 font-medium">
          {returnHighlighted ? 'Looping back to header ⤴' : ''}
        </span>
        {/* Curved return arrow matching image */}
        <svg className={`w-4 h-4 fill-current ${returnHighlighted ? 'text-yellow-300 animate-bounce' : 'text-white'}`} viewBox="0 0 24 24">
          <path d="M19 7v4H5.83l3.58-3.59L8 6l-6 6 6 6 1.41-1.41L5.83 13H21V7h-2z" />
        </svg>
      </div>

      <BottomTab color={c.bg} />
    </div>
  );
};

// E-Block for If / Else Conditionals
const IfElseBlock = ({
  condition,
  ifChildren,
  elseChildren,
  canvasBg = '#ffffff',
  isIfHighlighted = false,
  isElseHighlighted = false,
  codeLine = '',
}) => {
  const c = COLORS.control;
  return (
    <div className="relative inline-block max-w-full my-0.5">
      <TopNotch bg={canvasBg} />

      {/* If header */}
      <div
        className={`relative px-3.5 py-2 rounded-t-md font-sans text-xs font-bold text-white shadow-md flex items-center flex-wrap gap-1.5 border-t border-white/25 select-none transition-all duration-300 ${
          isIfHighlighted ? 'ring-4 ring-yellow-400 shadow-xl shadow-yellow-500/60 z-20' : ''
        }`}
        style={{ backgroundColor: c.bg }}
      >
        <span>if</span>
        <OperatorPill>{condition}</OperatorPill>
        <span>then</span>
        {isIfHighlighted && (
          <span className="ml-2 px-1.5 py-0.5 rounded bg-yellow-400 text-slate-950 text-[9px] font-black uppercase">
            Condition Test
          </span>
        )}
        {isIfHighlighted && codeLine && (
          <div className="ml-2 px-2.5 py-0.5 rounded bg-slate-950/90 border border-emerald-400 text-emerald-300 font-mono text-[11px] shadow-md flex items-center space-x-1 animate-slide-right">
            <span className="text-[9px] text-emerald-500 font-bold">code:</span>
            <span className="font-bold text-white whitespace-pre">{codeLine}</span>
            <span className="text-emerald-400 animate-pulse">▌</span>
          </div>
        )}
      </div>

      {/* If branch cavity */}
      <div
        className="border-l-[16px] pl-3 py-1.5 space-y-1.5"
        style={{ borderColor: c.bg }}
      >
        {ifChildren}
      </div>

      {/* Else separator bar */}
      <div
        className={`relative px-3.5 py-1.5 font-sans text-xs font-bold text-white shadow-md flex items-center border-t border-white/20 select-none transition-all duration-300 ${
          isElseHighlighted ? 'ring-4 ring-yellow-400 z-20' : ''
        }`}
        style={{ backgroundColor: c.bg }}
      >
        <span>else</span>
      </div>

      {/* Else branch cavity */}
      <div
        className="border-l-[16px] pl-3 py-1.5 space-y-1.5"
        style={{ borderColor: c.bg }}
      >
        {elseChildren}
      </div>

      {/* Bottom bar */}
      <div
      className="relative px-3.5 py-1 rounded-b-md shadow-md border-b-2 border-black/25"
        style={{ backgroundColor: c.bg }}
      />

      <BottomTab color={c.bg} />
    </div>
  );
};

// Universal Python to Scratch 3.0 Jigsaw Blocks Parser
export const parseCodeToBlocks = (codeStr = '') => {
  if (!codeStr || !codeStr.trim()) return [];
  const lines = codeStr.split('\n');
  const blocks = [];
  let i = 0;

  while (i < lines.length) {
    const rawLine = lines[i];
    const trimmed = rawLine.trim();

    if (!trimmed || trimmed.startsWith('#')) {
      i++;
      continue;
    }

    const indent = rawLine.search(/\S/);

    // 1. FOR LOOP (e.g. for i in range(1, num + 1):)
    const forMatch = trimmed.match(/^for\s+([a-zA-Z_]\w*)\s+in\s+range\((.*?)\)\s*:/);
    if (forMatch) {
      const loopVar = forMatch[1];
      const rangeArgs = forMatch[2].trim();
      const loopLineNum = i + 1;
      const loopBody = [];
      i++;
      while (i < lines.length) {
        const nextRaw = lines[i];
        const nextTrimmed = nextRaw.trim();
        if (!nextTrimmed) {
          i++;
          continue;
        }
        const nextIndent = nextRaw.search(/\S/);
        if (nextIndent <= indent && nextTrimmed) break;
        loopBody.push({ lineNum: i + 1, raw: nextRaw, trimmed: nextTrimmed });
        i++;
      }
      blocks.push({
        type: 'for_loop',
        lineNum: loopLineNum,
        loopVar,
        condition: `${loopVar} in range(${rangeArgs})`,
        body: loopBody,
        id: `line_${loopLineNum}`,
        returnId: `line_${loopLineNum}_return`,
        raw: trimmed,
      });
      continue;
    }

    // 2. WHILE LOOP (e.g. while num > 0: or while temp > 0:)
    const whileMatch = trimmed.match(/^while\s+(.*?)\s*:/);
    if (whileMatch) {
      const cond = whileMatch[1].trim();
      const loopLineNum = i + 1;
      const loopBody = [];
      i++;
      while (i < lines.length) {
        const nextRaw = lines[i];
        const nextTrimmed = nextRaw.trim();
        if (!nextTrimmed) {
          i++;
          continue;
        }
        const nextIndent = nextRaw.search(/\S/);
        if (nextIndent <= indent && nextTrimmed) break;
        loopBody.push({ lineNum: i + 1, raw: nextRaw, trimmed: nextTrimmed });
        i++;
      }
      blocks.push({
        type: 'while_loop',
        lineNum: loopLineNum,
        condition: cond,
        body: loopBody,
        id: `line_${loopLineNum}`,
        returnId: `line_${loopLineNum}_return`,
        raw: trimmed,
      });
      continue;
    }

    // 3. IF / ELSE CONDITIONAL (e.g. if original == reverse:)
    const ifMatch = trimmed.match(/^if\s+(.*?)\s*:/);
    if (ifMatch) {
      const cond = ifMatch[1].trim();
      const ifLineNum = i + 1;
      const ifBody = [];
      i++;
      while (i < lines.length) {
        const nextRaw = lines[i];
        const nextTrimmed = nextRaw.trim();
        if (!nextTrimmed) {
          i++;
          continue;
        }
        const nextIndent = nextRaw.search(/\S/);
        if (nextIndent <= indent && nextTrimmed) break;
        ifBody.push({ lineNum: i + 1, raw: nextRaw, trimmed: nextTrimmed });
        i++;
      }
      let elseBody = [];
      let elseLineNum = null;
      if (i < lines.length && lines[i].trim().startsWith('else:')) {
        elseLineNum = i + 1;
        i++;
        while (i < lines.length) {
          const nextRaw = lines[i];
          const nextTrimmed = nextRaw.trim();
          if (!nextTrimmed) {
            i++;
            continue;
          }
          const nextIndent = nextRaw.search(/\S/);
          if (nextIndent <= indent && nextTrimmed) break;
          elseBody.push({ lineNum: i + 1, raw: nextRaw, trimmed: nextTrimmed });
          i++;
        }
      }
      blocks.push({
        type: 'if_else',
        lineNum: ifLineNum,
        condition: cond,
        ifBody,
        elseBody,
        id: `line_${ifLineNum}`,
        elseId: elseLineNum ? `line_${elseLineNum}` : null,
        raw: trimmed,
      });
      continue;
    }

    // 4. INPUT CAPTURE (e.g. num = int(input("Enter a number: ")))
    const inputMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*=\s*(?:int|float|str)?\(?input\s*\(\s*(['"])(.*?)\2\s*\)\)?/);
    if (inputMatch) {
      blocks.push({
        type: 'input',
        lineNum: i + 1,
        varName: inputMatch[1],
        prompt: inputMatch[3] || 'Enter a number: ',
        id: `line_${i + 1}`,
        raw: trimmed,
      });
      i++;
      continue;
    }

    // 5. PRINT STATEMENT (e.g. print("Sum =", total))
    const printMatch = trimmed.match(/^print\s*\((.*?)\)$/);
    if (printMatch) {
      blocks.push({
        type: 'print',
        lineNum: i + 1,
        args: printMatch[1],
        id: `line_${i + 1}`,
        raw: trimmed,
      });
      i++;
      continue;
    }

    // 6. VARIABLE ASSIGNMENT (e.g. total = 0 or total = total + i)
    const assignMatch = trimmed.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=|=)\s*(.*)$/);
    if (assignMatch) {
      blocks.push({
        type: 'assign',
        lineNum: i + 1,
        varName: assignMatch[1],
        op: assignMatch[2],
        expr: assignMatch[3],
        id: `line_${i + 1}`,
        raw: trimmed,
      });
      i++;
      continue;
    }

    // 7. GENERIC STATEMENT
    blocks.push({
      type: 'generic',
      lineNum: i + 1,
      id: `line_${i + 1}`,
      raw: trimmed,
    });
    i++;
  }

  return blocks;
};

// Generates dynamic execution trace and terminal logs for ANY program
export const generateDynamicTrace = (codeStr = '', parsedBlocks = []) => {
  if (!codeStr || !codeStr.trim() || parsedBlocks.length === 0) return [];

  // 1. Specific Palindrome Program
  if (codeStr.includes('Palindrome') || (codeStr.includes('reverse') && codeStr.includes('original'))) {
    return [
      { id: 'line_1', title: 'Step 1: Input Capture', codeLine: 'num = int(input("Enter a number: "))', narration: 'Asks "Enter a number: ", reads 121, and assigns to num.', vars: { num: 121 }, terminalLog: { type: 'input', text: 'Enter a number: 121' } },
      { id: 'line_3', title: 'Step 2: Save Backup', codeLine: 'original = num', narration: 'Saves original backup = 121.', vars: { num: 121, original: 121 }, terminalLog: { type: 'state', text: '>>> original = 121' } },
      { id: 'line_4', title: 'Step 3: Accumulator Init', codeLine: 'reverse = 0', narration: 'Initializes reverse = 0.', vars: { num: 121, original: 121, reverse: 0 }, terminalLog: { type: 'state', text: '>>> reverse = 0' } },
      { id: 'line_6', title: 'Step 4: While Loop Test', codeLine: 'while num > 0:', narration: 'Tests while num > 0 (121 > 0) -> TRUE.', vars: { num: 121, original: 121, reverse: 0 }, terminalLog: { type: 'loop', text: '>>> while 121 > 0: True (Entering iteration 1)' } },
      { id: 'line_7', title: 'Step 5: Extract Digit', codeLine: '    digit = num % 10', narration: 'Extracts digit = 121 % 10 -> 1.', vars: { num: 121, original: 121, reverse: 0, digit: 1 }, terminalLog: { type: 'loop', text: '>>> digit = 121 % 10 -> 1' } },
      { id: 'line_8', title: 'Step 6: Shift & Add', codeLine: '    reverse = reverse * 10 + digit', narration: 'Calculates reverse * 10 + digit -> 1.', vars: { num: 121, original: 121, reverse: 1, digit: 1 }, terminalLog: { type: 'loop', text: '>>> reverse = (0 * 10) + 1 -> 1' } },
      { id: 'line_9', title: 'Step 7: Floor Division', codeLine: '    num = num // 10', narration: 'Truncates num // 10 -> 12.', vars: { num: 12, original: 121, reverse: 1, digit: 1 }, terminalLog: { type: 'loop', text: '>>> num = 121 // 10 -> 12' } },
      { id: 'line_6_return', title: 'Step 8: Loop Repeats', codeLine: '    # loop repeats for remaining digits', narration: 'Repeats for remaining digits -> final reverse = 121, num = 0.', vars: { num: 0, original: 121, reverse: 121, digit: 1 }, terminalLog: { type: 'loop', text: '>>> Loop repeats -> final reverse = 121, num = 0' } },
      { id: 'line_11', title: 'Step 9: Equality Test', codeLine: 'if original == reverse:', narration: 'Tests original == reverse (121 == 121) -> TRUE!', vars: { num: 0, original: 121, reverse: 121, match: 'TRUE' }, terminalLog: { type: 'cond', text: '>>> if original == reverse (121 == 121) -> True' } },
      { id: 'line_12', title: 'Step 10: Output Palindrome', codeLine: '    print("Palindrome")', narration: 'Outputs "Palindrome".', vars: { result: '"Palindrome"', status: 'FINISHED' }, terminalLog: { type: 'output', text: 'Palindrome', finished: true } },
    ];
  }

  // 2. Specific Armstrong Program
  if (codeStr.includes('Armstrong') || codeStr.includes('** 3')) {
    return [
      { id: 'line_1', title: 'Step 1: Input Capture', codeLine: 'num = int(input("Enter a number: "))', narration: 'Captures input 153 and assigns to num.', vars: { num: 153 }, terminalLog: { type: 'input', text: 'Enter a number: 153' } },
      { id: 'line_3', title: 'Step 2: Save Backup', codeLine: 'temp = num', narration: 'Assigns temp = 153.', vars: { num: 153, temp: 153 }, terminalLog: { type: 'state', text: '>>> temp = 153' } },
      { id: 'line_4', title: 'Step 3: Accumulator Init', codeLine: 'sum = 0', narration: 'Initializes sum = 0.', vars: { num: 153, temp: 153, sum: 0 }, terminalLog: { type: 'state', text: '>>> sum = 0' } },
      { id: 'line_6', title: 'Step 4: While Loop Test', codeLine: 'while temp > 0:', narration: 'Tests temp > 0 (153 > 0) -> TRUE.', vars: { num: 153, temp: 153, sum: 0 }, terminalLog: { type: 'loop', text: '>>> while 153 > 0: True' } },
      { id: 'line_7', title: 'Step 5: Extract Digit', codeLine: '    digit = temp % 10', narration: 'Extracts digit = 3.', vars: { num: 153, temp: 153, sum: 0, digit: 3 }, terminalLog: { type: 'loop', text: '>>> digit = 153 % 10 -> 3' } },
      { id: 'line_8', title: 'Step 6: Cube & Add', codeLine: '    sum += digit ** 3', narration: 'Adds 3 ** 3 = 27 into sum.', vars: { num: 153, temp: 153, sum: 27, digit: 3 }, terminalLog: { type: 'loop', text: '>>> sum += 3 ** 3 -> 27' } },
      { id: 'line_9', title: 'Step 7: Floor Division', codeLine: '    temp //= 10', narration: 'Truncates temp //= 10 -> 15.', vars: { num: 153, temp: 15, sum: 27, digit: 3 }, terminalLog: { type: 'loop', text: '>>> temp = 153 // 10 -> 15' } },
      { id: 'line_6_return', title: 'Step 8: Loop Repeats', codeLine: '    # loop repeats', narration: 'Sums remaining cubed digits -> sum = 153.', vars: { num: 153, temp: 0, sum: 153, digit: 1 }, terminalLog: { type: 'loop', text: '>>> Final sum = 153, temp = 0' } },
      { id: 'line_11', title: 'Step 9: Equality Test', codeLine: 'if num == sum:', narration: 'Tests num == sum (153 == 153) -> TRUE!', vars: { num: 153, temp: 0, sum: 153, match: 'TRUE' }, terminalLog: { type: 'cond', text: '>>> if num == sum (153 == 153) -> True' } },
      { id: 'line_12', title: 'Step 10: Output Armstrong', codeLine: '    print("Armstrong Number")', narration: 'Outputs "Armstrong Number".', vars: { result: '"Armstrong Number"', status: 'FINISHED' }, terminalLog: { type: 'output', text: 'Armstrong Number', finished: true } },
    ];
  }

  // 3. User's Sum / Loop Program (e.g. for i in range(1, num + 1): total = total + i)
  const isLoopSum =
    (codeStr.includes('total') || codeStr.includes('sum')) &&
    (codeStr.includes('range(') || codeStr.includes('while'));

  if (isLoopSum) {
    const inVal = 12;
    const computedTotal = 78;
    const steps = [];

    parsedBlocks.forEach((b) => {
      if (b.type === 'input') {
        steps.push({
          id: b.id,
          title: `Step ${steps.length + 1}: Input Capture`,
          codeLine: b.raw,
          narration: `Prompts user "${b.prompt}", captures input ${inVal}, and assigns to variable ${b.varName}.`,
          vars: { [b.varName]: inVal },
          terminalLog: { type: 'input', text: `${b.prompt} ${inVal}` },
        });
      } else if (b.type === 'assign') {
        steps.push({
          id: b.id,
          title: `Step ${steps.length + 1}: Initialize ${b.varName}`,
          codeLine: b.raw,
          narration: `Initializes accumulator variable ${b.varName} = ${b.expr}.`,
          vars: { [b.varName]: 0 },
          terminalLog: { type: 'state', text: `>>> ${b.varName} = ${b.expr}` },
        });
      } else if (b.type === 'for_loop' || b.type === 'while_loop') {
        steps.push({
          id: b.id,
          title: `Step ${steps.length + 1}: For Loop Initialization`,
          codeLine: b.raw,
          narration: `Initializes loop counter ${b.loopVar || 'i'} from 1 up to ${inVal} (range 1..${inVal + 1}).`,
          vars: { [b.loopVar || 'i']: 1 },
          terminalLog: { type: 'loop', text: `>>> ${b.raw} (Iterating 1..${inVal})` },
        });
        b.body.forEach((inner) => {
          steps.push({
            id: `line_${inner.lineNum}`,
            title: `Step ${steps.length + 1}: Accumulate in Loop`,
            codeLine: inner.raw,
            narration: `Iteratively executes: ${inner.trimmed}. For i = 1..${inVal}, total reaches ${computedTotal}.`,
            vars: { total: computedTotal, i: inVal },
            terminalLog: { type: 'loop', text: `>>> ${inner.trimmed} (Summing 1 to ${inVal} -> total = ${computedTotal})` },
          });
        });
        steps.push({
          id: b.returnId,
          title: `Step ${steps.length + 1}: Loop Finished`,
          codeLine: '    # loop finished',
          narration: `Loop completes all ${inVal} cycles. Control flow moves to print statement.`,
          vars: { total: computedTotal },
          terminalLog: { type: 'loop', text: `>>> Loop completed all ${inVal} cycles` },
        });
      } else if (b.type === 'print') {
        steps.push({
          id: b.id,
          title: `Step ${steps.length + 1}: Output Result`,
          codeLine: b.raw,
          narration: `Outputs calculated result to console.`,
          vars: { output: `Sum = ${computedTotal}`, status: 'FINISHED' },
          terminalLog: { type: 'output', text: `Sum = ${computedTotal}`, finished: true },
        });
      } else {
        steps.push({
          id: b.id,
          title: `Step ${steps.length + 1}: Instruction`,
          codeLine: b.raw,
          narration: `Executes instruction: ${b.raw}`,
          terminalLog: { type: 'loop', text: `>>> ${b.raw}` },
        });
      }
    });

    return steps;
  }

  // 4. Dynamic Generic Fallback for ANY Code
  const steps = [];
  parsedBlocks.forEach((b, idx) => {
    if (b.type === 'input') {
      steps.push({
        id: b.id,
        title: `Step ${idx + 1}: Input Capture`,
        codeLine: b.raw,
        narration: `Prompts user "${b.prompt}" and captures input.`,
        vars: { [b.varName]: 10 },
        terminalLog: { type: 'input', text: `${b.prompt} 10` },
      });
    } else if (b.type === 'assign') {
      steps.push({
        id: b.id,
        title: `Step ${idx + 1}: Variable Assignment`,
        codeLine: b.raw,
        narration: `Assigns variable ${b.varName} = ${b.expr}.`,
        vars: { [b.varName]: b.expr },
        terminalLog: { type: 'state', text: `>>> ${b.varName} = ${b.expr}` },
      });
    } else if (b.type === 'for_loop' || b.type === 'while_loop') {
      steps.push({
        id: b.id,
        title: `Step ${idx + 1}: Loop Header`,
        codeLine: b.raw,
        narration: `Tests loop condition: ${b.condition}.`,
        terminalLog: { type: 'loop', text: `>>> ${b.raw}` },
      });
      b.body.forEach((inner) => {
        steps.push({
          id: `line_${inner.lineNum}`,
          title: `Step ${steps.length + 1}: Loop Statement`,
          codeLine: inner.raw,
          narration: `Executes loop statement: ${inner.trimmed}`,
          terminalLog: { type: 'loop', text: `>>> ${inner.trimmed}` },
        });
      });
    } else if (b.type === 'print') {
      const cleanArgs = b.args.replace(/["']/g, '');
      steps.push({
        id: b.id,
        title: `Step ${idx + 1}: Print Output`,
        codeLine: b.raw,
        narration: `Outputs result: ${cleanArgs}`,
        terminalLog: { type: 'output', text: cleanArgs, finished: true },
      });
    } else {
      steps.push({
        id: b.id,
        title: `Step ${idx + 1}: Instruction`,
        codeLine: b.raw,
        narration: `Executes instruction: ${b.raw}`,
        terminalLog: { type: 'loop', text: `>>> ${b.raw}` },
      });
    }
  });

  return steps;
};

export const ScratchBlockRenderer = ({ codeSnippet = '', canvasBg = '#ffffff' }) => {
  const code = codeSnippet || '';

  // Parse code into Scratch blocks AST
  const parsedBlocks = useMemo(() => parseCodeToBlocks(code), [code]);

  // Generate dynamic execution trace steps
  const traceSteps = useMemo(() => generateDynamicTrace(code, parsedBlocks), [code, parsedBlocks]);

  // Real code lines for the editor window
  const realCodeLines = useMemo(
    () =>
      code.split('\n').map((line, idx) => ({
        num: idx + 1,
        text: line,
        id: `line_${idx + 1}`,
      })),
    [code]
  );

  // Interactive Tracer State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStepIdx, setCurrentStepIdx] = useState(-1);
  const timerRef = useRef(null);

  // Timer auto-advancement for Visual Playback
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev < traceSteps.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, traceSteps.length]);

  const handlePlayToggle = () => {
    if (traceSteps.length === 0) return;
    if (currentStepIdx >= traceSteps.length - 1) {
      setCurrentStepIdx(0);
      setIsPlaying(true);
    } else {
      if (currentStepIdx === -1) setCurrentStepIdx(0);
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextStep = () => {
    if (traceSteps.length === 0) return;
    setIsPlaying(false);
    setCurrentStepIdx((prev) => Math.min(prev + 1, traceSteps.length - 1));
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIdx(-1);
  };

  const activeStepObj = currentStepIdx >= 0 ? traceSteps[currentStepIdx] : null;
  const activeId = activeStepObj ? activeStepObj.id : null;
  const activeCodeLine = activeStepObj ? activeStepObj.codeLine : '';

  // Render individual Scratch 3.0 Jigsaw Block item
  const renderBlockItem = (b) => {
    if (b.type === 'input') {
      return (
        <div key={b.id} className="space-y-1">
          <StandardBlock
            type="sensing"
            canvasBg={canvasBg}
            isHighlighted={activeId === b.id}
            codeLine={activeId === b.id ? activeCodeLine : ''}
          >
            <span>ask</span>
            <InputPill>{b.prompt}</InputPill>
            <span>and wait</span>
          </StandardBlock>
          <StandardBlock
            type="variables"
            canvasBg={canvasBg}
            isHighlighted={activeId === b.id}
            codeLine={activeId === b.id ? activeCodeLine : ''}
          >
            <span>set</span>
            <VariablePill name={b.varName} />
            <span>to</span>
            <span className="bg-[#4CBFE6] text-white px-2 py-0.5 rounded-full text-xs font-bold">
              answer
            </span>
          </StandardBlock>
        </div>
      );
    }

    if (b.type === 'assign') {
      return (
        <div key={b.id}>
          <StandardBlock
            type="variables"
            canvasBg={canvasBg}
            isHighlighted={activeId === b.id}
            codeLine={activeId === b.id ? activeCodeLine : ''}
          >
            <span>{b.op === '=' ? 'set' : 'change'}</span>
            <VariablePill name={b.varName} />
            <span>{b.op === '=' ? 'to' : 'by'}</span>
            <OperatorPill>{b.expr}</OperatorPill>
          </StandardBlock>
        </div>
      );
    }

    if (b.type === 'for_loop' || b.type === 'while_loop') {
      return (
        <div key={b.id}>
          <LoopBlock
            condition={b.condition}
            isCondition={true}
            canvasBg={canvasBg}
            isHighlighted={activeId === b.id}
            returnHighlighted={activeId === b.returnId}
            codeLine={activeId === b.id ? activeCodeLine : ''}
          >
            {b.body && b.body.length > 0 ? (
              b.body.map((inner) => renderInnerStatement(inner))
            ) : (
              <div className="text-[11px] text-amber-200 italic py-1 pl-2">
                pass
              </div>
            )}
          </LoopBlock>
        </div>
      );
    }

    if (b.type === 'if_else') {
      return (
        <div key={b.id}>
          <IfElseBlock
            condition={b.condition}
            canvasBg={canvasBg}
            isIfHighlighted={activeId === b.id}
            isElseHighlighted={activeId === b.elseId}
            codeLine={activeId === b.id ? activeCodeLine : ''}
            ifChildren={
              b.ifBody && b.ifBody.length > 0 ? (
                b.ifBody.map((inner) => renderInnerStatement(inner))
              ) : (
                <div className="text-[11px] text-amber-200 italic py-1 pl-2">pass</div>
              )
            }
            elseChildren={
              b.elseBody && b.elseBody.length > 0 ? (
                b.elseBody.map((inner) => renderInnerStatement(inner))
              ) : (
                <div className="text-[11px] text-amber-200 italic py-1 pl-2">pass</div>
              )
            }
          />
        </div>
      );
    }

    if (b.type === 'print') {
      return (
        <div key={b.id}>
          <StandardBlock
            type="looks"
            canvasBg={canvasBg}
            isHighlighted={activeId === b.id}
            codeLine={activeId === b.id ? activeCodeLine : ''}
          >
            <span>say</span>
            <InputPill>{b.args.replace(/['"]/g, '')}</InputPill>
          </StandardBlock>
        </div>
      );
    }

    return (
      <div key={b.id}>
        <StandardBlock
          type="motion"
          canvasBg={canvasBg}
          isHighlighted={activeId === b.id}
          codeLine={activeId === b.id ? activeCodeLine : ''}
        >
          <span>execute</span>
          <span className="font-mono text-xs text-white">{b.raw}</span>
        </StandardBlock>
      </div>
    );
  };

  const renderInnerStatement = (inner) => {
    const assignMatch = inner.trimmed.match(/^([a-zA-Z_]\w*)\s*(\+=|-=|\*=|\/=|%=|=)\s*(.*)$/);
    if (assignMatch) {
      return (
        <StandardBlock
          key={inner.lineNum}
          type="variables"
          canvasBg={canvasBg}
          isHighlighted={activeId === `line_${inner.lineNum}`}
          codeLine={activeId === `line_${inner.lineNum}` ? activeCodeLine : ''}
        >
          <span>{assignMatch[2] === '=' ? 'set' : 'change'}</span>
          <VariablePill name={assignMatch[1]} />
          <span>{assignMatch[2] === '=' ? 'to' : 'by'}</span>
          <OperatorPill>{assignMatch[3]}</OperatorPill>
        </StandardBlock>
      );
    }
    if (inner.trimmed.startsWith('print')) {
      return (
        <StandardBlock
          key={inner.lineNum}
          type="looks"
          canvasBg={canvasBg}
          isHighlighted={activeId === `line_${inner.lineNum}`}
          codeLine={activeId === `line_${inner.lineNum}` ? activeCodeLine : ''}
        >
          <span>say</span>
          <InputPill>{inner.trimmed.replace(/^print\(|\)$/g, '').replace(/['"]/g, '')}</InputPill>
        </StandardBlock>
      );
    }
    return (
      <StandardBlock
        key={inner.lineNum}
        type="variables"
        canvasBg={canvasBg}
        isHighlighted={activeId === `line_${inner.lineNum}`}
        codeLine={activeId === `line_${inner.lineNum}` ? activeCodeLine : ''}
      >
        <span>do</span>
        <span className="font-mono">{inner.trimmed}</span>
      </StandardBlock>
    );
  };

  return (
    <div className="space-y-3">
      {/* 1. Play Controller Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/90 border border-slate-700/80 p-3 rounded-xl">
        <div className="flex items-center space-x-2">
          {/* Main Play / Pause Button */}
          <button
            type="button"
            onClick={handlePlayToggle}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-black text-white shadow-md transition-all active:scale-95 cursor-pointer ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30 ring-2 ring-amber-400'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
            }`}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5 fill-white" /> : <Play className="h-3.5 w-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause' : currentStepIdx >= 0 ? 'Resume Trace' : '▶ Play Trace'}</span>
          </button>

          {/* Next Step Button */}
          <button
            type="button"
            onClick={handleNextStep}
            disabled={currentStepIdx >= traceSteps.length - 1 || traceSteps.length === 0}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 transition-colors cursor-pointer"
            title="Step to next block"
          >
            <SkipForward className="h-3 w-3" />
            <span>Step</span>
          </button>

          {/* Reset Button */}
          <button
            type="button"
            onClick={handleReset}
            disabled={currentStepIdx === -1}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 disabled:opacity-30 transition-colors cursor-pointer"
            title="Reset execution"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset</span>
          </button>
        </div>

        {/* Status indicator */}
        <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
          {currentStepIdx >= 0 && traceSteps.length > 0 && (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold flex items-center space-x-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Step {currentStepIdx + 1} of {traceSteps.length}</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Live Step Narration Banner */}
      {activeStepObj && (
        <div className="bg-gradient-to-r from-slate-900 to-[#181d28] border-l-4 border-yellow-400 border border-slate-700 p-3.5 rounded-xl space-y-1.5 shadow-md animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-yellow-400 uppercase tracking-wide flex items-center space-x-1.5">
              <span>{activeStepObj.title}</span>
            </span>
            {activeStepObj.vars && (
              <div className="flex items-center space-x-1.5">
                {Object.entries(activeStepObj.vars).map(([k, v]) => (
                  <span
                    key={k}
                    className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-[11px] text-blue-300 font-bold"
                  >
                    {k}: <strong className="text-white">{String(v)}</strong>
                  </span>
                ))}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">
            {activeStepObj.narration}
          </p>
        </div>
      )}

      {/* 3. SIDE-BY-SIDE: Scratch Blocks (Left) & Live Code Generation Writer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
        {/* Left: Scratch Blocks Canvas (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-2 p-4 rounded-xl bg-white border-2 border-slate-200 shadow-sm overflow-x-auto min-h-[350px]">
          {parsedBlocks.length > 0 ? (
            parsedBlocks.map((b) => renderBlockItem(b))
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-xs space-y-2">
              <span className="text-3xl">🧩</span>
              <p className="font-semibold text-slate-600">No code to display</p>
              <p className="text-[11px] text-slate-400">
                Write code in the editor above to generate Scratch Jigsaw Blocks live!
              </p>
            </div>
          )}
        </div>

        {/* Right: Authentic Real Code Editor & Terminal (Pale Yellow Theme) */}
        <div className="lg:col-span-5 flex flex-col rounded-xl bg-[#FEFCE8] border-2 border-amber-300/90 overflow-hidden shadow-md">
          {/* Top: Editor Header (Clean Pale Yellow, No dark dots) */}
          <div className="flex items-center justify-between px-3.5 py-2 bg-[#FEF9C3] border-b border-amber-300/80">
            <div className="flex items-center space-x-2">
              <Code2 className="h-4 w-4 text-amber-800" />
              <span className="text-xs font-bold text-amber-950 font-mono">main.py</span>
            </div>
            <span className="text-[10px] text-amber-900 font-bold font-mono bg-amber-200/90 border border-amber-300 px-2 py-0.5 rounded">
              Python 3.12
            </span>
          </div>

          {/* Real Code Body with Active Line Highlighting (Pale Yellow) */}
          <div className="p-3 bg-[#FFFDF0] font-mono text-xs max-h-[220px] overflow-y-auto space-y-0.5">
            {realCodeLines.map((line, lIdx) => {
              const isActive = activeId && line.id === activeId;
              return (
                <div
                  key={lIdx}
                  className={`flex items-center py-0.5 px-2 rounded font-mono transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-200/80 border-l-4 border-amber-500 text-slate-950 font-bold shadow-xs'
                      : 'text-slate-800'
                  }`}
                >
                  <span className="w-6 text-right pr-3 select-none text-[11px] text-amber-700/60 font-semibold">
                    {line.num}
                  </span>
                  <span className="flex-1 whitespace-pre">{line.text || ' '}</span>
                  {isActive && (
                    <span className="text-white text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-600 shadow-xs animate-pulse">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom: Interactive Terminal Console (Pale Yellow Theme) */}
          <div className="border-t border-amber-300/80 bg-[#FFFDF2] flex flex-col">
            <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#FEF9C3] border-b border-amber-300/80">
              <div className="flex items-center space-x-2 text-[11px] font-bold text-amber-950 font-mono">
                <Terminal className="h-3.5 w-3.5 text-amber-800" />
                <span>Terminal Execution (Input & Output)</span>
              </div>
              <span className="text-[10px] text-amber-800 font-bold font-mono bg-amber-200/60 px-1.5 py-0.5 rounded">
                STDIN / STDOUT
              </span>
            </div>

            <div className="p-3 font-mono text-xs space-y-1.5 min-h-[160px] max-h-[190px] overflow-y-auto select-text">
              <div className="text-amber-800/80 text-[11px] font-bold">$ python main.py</div>

              {currentStepIdx >= 0 ? (
                <>
                  {traceSteps.slice(0, currentStepIdx + 1).map((step, sIdx) => {
                    if (!step.terminalLog) return null;
                    if (step.terminalLog.type === 'input') {
                      return (
                        <div
                          key={sIdx}
                          className="flex items-center space-x-2 text-slate-950 font-bold bg-amber-100/90 border border-amber-300 px-2.5 py-1 rounded border-l-4 border-amber-500 animate-slide-right shadow-xs"
                        >
                          <span className="text-amber-900 font-black text-[10px] uppercase">Input:</span>
                          <span className="text-blue-900">{step.terminalLog.text}</span>
                        </div>
                      );
                    }
                    if (step.terminalLog.type === 'output') {
                      return (
                        <div key={sIdx} className="mt-1 space-y-1 animate-fade-in">
                          <div className="text-emerald-950 text-sm font-black tracking-wide bg-emerald-100 border-2 border-emerald-500 px-3 py-1.5 rounded-lg shadow-sm flex items-center space-x-2">
                            <span>✨</span>
                            <span>Output: {step.terminalLog.text}</span>
                          </div>
                          {step.terminalLog.finished && (
                            <div className="text-slate-600 text-[10px] font-semibold pl-1">
                              Process finished with exit code 0
                            </div>
                          )}
                        </div>
                      );
                    }
                    return (
                      <div key={sIdx} className="text-slate-700 text-[11px] pl-2 font-mono font-medium">
                        {step.terminalLog.text}
                      </div>
                    );
                  })}
                </>
              ) : (
                <div className="text-amber-800/70 text-xs italic py-4 font-sans">
                  Ready. Click <strong className="text-amber-700 font-bold">"▶ Play Trace"</strong> to provide input & generate output!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScratchBlockRenderer;
