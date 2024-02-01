<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Project;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $query = Project::query();

        // Search filter
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
            $query->orWhere('status', 'like', '%' . $request->input('search') . '%');
        }

        // Pagination
        $projects = $query->orderBy('order','Asc')->paginate(5); // Adjust the per-page count as needed


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
            'status' => 'required|in:Pending,In Progress,Completed'
        ]);

        // Find the project
        $project = Project::find($id);

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        // Update the project
        $project->update(['name' => $request->input('name'),
        'start_date' => $request->input('start_date'),
        'end_date' => $request->input('end_date'),
        'status' =>  $request->input('status')]);

        return response()->json(['project' => $project]);
    }

    public function updateOrders(Request $request)
{
    $projectUpdates = $request->input('projects');

    foreach ($projectUpdates as $update) {
        Project::where('id', $update['id'])->update(['order' => $update['order']]);
    }

    return response()->json(['message' => 'Project orders updated successfully']);
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

public function changeFavorite($id)
{
    $isStared = Project::where('id', $id)->first();
    if($isStared)
    {
        Project::where('id', $id)->update(['stared' => ($isStared->stared == 'No')?'Yes':'No']);
        $msg = ($isStared->stared == 'No')?'Added to':'Removed from';
    }
    else
    {
        return response()->json(['error' => 'Project not found'], 404);
    }
    return response()->json(['message' => "Project $msg favorite successfully"]);
}


public function myFavorites()
{
    $favorite = Project::where('stared', 'Yes')->get();

    return response()->json(['favorite' => $favorite  ]);
}
}
