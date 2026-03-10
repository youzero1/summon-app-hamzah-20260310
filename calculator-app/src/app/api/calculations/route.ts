import { NextRequest, NextResponse } from 'next/server';
import { getDataSource } from '@/lib/dataSource';
import { Calculation } from '@/entity/Calculation';

export async function GET() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);
    const calculations = await repo.find({
      order: { createdAt: 'DESC' },
    });
    return NextResponse.json(calculations);
  } catch (error) {
    console.error('GET /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch calculations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { operand1, operand2, operator } = body as {
      operand1: number;
      operand2: number;
      operator: string;
    };

    if (
      operand1 === undefined ||
      operand2 === undefined ||
      !operator
    ) {
      return NextResponse.json(
        { error: 'Missing required fields: operand1, operand2, operator' },
        { status: 400 }
      );
    }

    let result: number;
    switch (operator) {
      case '+':
        result = operand1 + operand2;
        break;
      case '-':
        result = operand1 - operand2;
        break;
      case '*':
        result = operand1 * operand2;
        break;
      case '/':
        if (operand2 === 0) {
          return NextResponse.json(
            { error: 'Division by zero' },
            { status: 400 }
          );
        }
        result = operand1 / operand2;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid operator' },
          { status: 400 }
        );
    }

    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);

    const calculation = repo.create({
      operand1,
      operand2,
      operator,
      result,
    });

    await repo.save(calculation);

    return NextResponse.json(calculation, { status: 201 });
  } catch (error) {
    console.error('POST /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to perform calculation' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const ds = await getDataSource();
    const repo = ds.getRepository(Calculation);
    await repo.clear();
    return NextResponse.json({ message: 'History cleared' });
  } catch (error) {
    console.error('DELETE /api/calculations error:', error);
    return NextResponse.json(
      { error: 'Failed to clear history' },
      { status: 500 }
    );
  }
}
