<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index()
    {
        // Get all projects
        $projects = Project::all();

        return response()->json(['projects' => $projects]);
    }

    public function show($id)
    {
        // Get a specific project
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        return response()->json(['project' => $project]);
    }

    public function store(Request $request)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => 'required|in:Pending,In Progress,Completed',
        ]);

        // Create a new project
        $project = Project::create($request->all());

        return response()->json(['project' => $project], 201);
    }

    public function update(Request $request, $id)
    {
        // Validate request data
        $request->validate([
            'name' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'status' => 'required|in:Pending,In Progress,Completed',
        ]);

        // Find the project
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        // Update the project
        $project->update($request->all());

        return response()->json(['project' => $project]);
    }

    public function destroy($id)
    {
        // Find the project
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        // Delete the project
        $project->delete();

        return response()->json(['message' => 'Project deleted']);
    }

    public function statistics()
{
    // Get total number of projects
    $totalProjects = Project::count();

    // Get number of completed projects
    $completedProjects = Project::where('status', 'Completed')->count();

    // Get number of ongoing projects
    $ongoingProjects = Project::where('status', 'In Progress')->count();

    return response()->json([
        'totalProjects' => $totalProjects,
        'completedProjects' => $completedProjects,
        'ongoingProjects' => $ongoingProjects,
    ]);
}
}
