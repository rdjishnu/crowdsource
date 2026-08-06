import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../core/constants.dart';
import '../core/routes.dart';
import '../providers/issue_provider.dart';
import '../widgets/issue_card.dart';

class ComplaintHistoryScreen extends StatefulWidget {
  const ComplaintHistoryScreen({super.key});

  @override
  State<ComplaintHistoryScreen> createState() => _ComplaintHistoryScreenState();
}

class _ComplaintHistoryScreenState extends State<ComplaintHistoryScreen> {
  String _selectedStatus = 'All';
  String _selectedCategory = 'All';
  final TextEditingController _searchController = TextEditingController();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      context.read<IssueProvider>().fetchIssues();
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _applyFilter() {
    context.read<IssueProvider>().fetchIssues(
          status: _selectedStatus,
          category: _selectedCategory,
          search: _searchController.text.trim(),
        );
  }

  @override
  Widget build(BuildContext context) {
    final issueProvider = context.watch<IssueProvider>();

    return Scaffold(
      appBar: AppBar(
        title: const Text('My Complaint History'),
      ),
      body: Column(
        children: [
          // Search & Filter Header Bar
          Container(
            padding: const EdgeInsets.all(16),
            color: Colors.white.withOpacity(0.02),
            child: Column(
              children: [
                // Search Field
                TextField(
                  controller: _searchController,
                  onChanged: (_) => _applyFilter(),
                  decoration: InputDecoration(
                    hintText: 'Search complaint ID, keywords...',
                    prefixIcon: const Icon(Icons.search, size: 20),
                    filled: true,
                    fillColor: Colors.white.withOpacity(0.05),
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),
                const SizedBox(height: 12),

                // Horizontal Filter Chips
                SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildChip('Status: All', _selectedStatus == 'All', () {
                        setState(() => _selectedStatus = 'All');
                        _applyFilter();
                      }),
                      ...AppConstants.statuses.map((st) => _buildChip(st, _selectedStatus == st, () {
                            setState(() => _selectedStatus = st);
                            _applyFilter();
                          })),
                    ],
                  ),
                ),
              ],
            ),
          ),

          // Complaint List
          Expanded(
            child: RefreshIndicator(
              onRefresh: () => issueProvider.fetchIssues(
                status: _selectedStatus,
                category: _selectedCategory,
                search: _searchController.text.trim(),
              ),
              child: issueProvider.isLoading
                  ? const Center(child: CircularProgressIndicator())
                  : issueProvider.issues.isEmpty
                      ? const Center(
                          child: Text(
                            'No complaints found matching filter.',
                            style: TextStyle(color: Colors.grey),
                          ),
                        )
                      : ListView.builder(
                          padding: const EdgeInsets.all(16),
                          itemCount: issueProvider.issues.length,
                          itemBuilder: (context, index) {
                            final issue = issueProvider.issues[index];
                            return IssueCard(
                              issue: issue,
                              onTap: () => Navigator.pushNamed(
                                context,
                                AppRoutes.issueDetail,
                                arguments: issue,
                              ),
                            );
                          },
                        ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildChip(String label, bool isSelected, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ChoiceChip(
        label: Text(label, style: TextStyle(fontSize: 12, color: isSelected ? Colors.white : Colors.grey)),
        selected: isSelected,
        selectedColor: AppColors.primary,
        backgroundColor: Colors.white.withOpacity(0.05),
        onSelected: (_) => onTap(),
      ),
    );
  }
}
