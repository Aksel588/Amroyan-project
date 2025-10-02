<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Calculator;
use App\Models\CalculatorRate;

class CalculatorController extends Controller
{
    public function index()
    {
        $calculators = Calculator::orderBy('sort_order', 'asc')->get();
        
        return response()->json([
            'data' => $calculators
        ]);
    }

    public function show($id)
    {
        $calculator = Calculator::findOrFail($id);
        
        return response()->json([
            'data' => $calculator
        ]);
    }

    public function rates($id)
    {
        $rates = CalculatorRate::where('calculator_id', $id)
            ->orderBy('sort_order', 'asc')
            ->get();
        
        return response()->json([
            'data' => $rates
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:calculators',
            'description' => 'nullable|string',
            'icon_name' => 'required|string|max:100',
            'visible' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $calculator = Calculator::create($request->all());

        return response()->json([
            'message' => 'Calculator created successfully',
            'data' => $calculator
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $calculator = Calculator::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'slug' => 'sometimes|required|string|max:255|unique:calculators,slug,' . $id,
            'description' => 'sometimes|nullable|string',
            'icon_name' => 'sometimes|required|string|max:100',
            'visible' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer'
        ]);

        $calculator->update($request->all());

        return response()->json([
            'message' => 'Calculator updated successfully',
            'data' => $calculator
        ]);
    }

    public function destroy($id)
    {
        $calculator = Calculator::findOrFail($id);
        $calculator->delete();

        return response()->json([
            'message' => 'Calculator deleted successfully'
        ]);
    }

    // Calculator rates management methods
    public function storeRate(Request $request)
    {
        $request->validate([
            'calculator_id' => 'required|exists:calculators,id',
            'label' => 'required|string|max:255',
            'rate' => 'required|numeric|min:0|max:100',
            'visible' => 'boolean',
            'sort_order' => 'integer',
            'effective_from' => 'nullable|date',
            'effective_to' => 'nullable|date|after:effective_from'
        ]);

        $rate = CalculatorRate::create($request->all());

        return response()->json([
            'message' => 'Calculator rate created successfully',
            'data' => $rate
        ], 201);
    }

    public function updateRate(Request $request, $id)
    {
        $rate = CalculatorRate::findOrFail($id);

        $request->validate([
            'label' => 'sometimes|required|string|max:255',
            'rate' => 'sometimes|required|numeric|min:0|max:100',
            'visible' => 'sometimes|boolean',
            'sort_order' => 'sometimes|integer',
            'effective_from' => 'sometimes|nullable|date',
            'effective_to' => 'sometimes|nullable|date|after:effective_from'
        ]);

        $rate->update($request->all());

        return response()->json([
            'message' => 'Calculator rate updated successfully',
            'data' => $rate
        ]);
    }

    public function destroyRate($id)
    {
        $rate = CalculatorRate::findOrFail($id);
        $rate->delete();

        return response()->json([
            'message' => 'Calculator rate deleted successfully'
        ]);
    }
}
