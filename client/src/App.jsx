import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock3,
  FileText,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Ticket,
  Trash2,
  X,
} from "lucide-react";

import "./App.css";

const API_URL = "http://localhost:5000/api";

const STATUS_OPTIONS = [
  { value: "ALL", label: "All Tickets" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "CLOSED", label: "Closed" },
];

function App() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [notes, setNotes] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [newTicket, setNewTicket] = useState({
    customerName: "",
    customerEmail: "",
    subject: "",
    description: "",
  });

  const [noteText, setNoteText] = useState("");

  /*
   * Load tickets from the API.
   *
   * useCallback keeps this function stable unless the selected
   * status or search value changes.
   */
  const fetchTickets = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      if (statusFilter !== "ALL") {
        params.append("status", statusFilter);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      const query = params.toString();

      const response = await fetch(
        `${API_URL}/tickets${query ? `?${query}` : ""}`
      );

      if (!response.ok) {
        throw new Error("Unable to load tickets.");
      }

      const data = await response.json();

      setTickets(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  /*
   * Load tickets when the page first opens
   * and whenever search/status changes.
   */
  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const fetchTicketDetails = async (ticketId) => {
    try {
      setDetailsLoading(true);
      setNotesLoading(true);
      setError("");

      const [ticketResponse, notesResponse] = await Promise.all([
        fetch(`${API_URL}/tickets/${ticketId}`),
        fetch(`${API_URL}/tickets/${ticketId}/notes`),
      ]);

      if (!ticketResponse.ok) {
        throw new Error("Unable to load ticket details.");
      }

      const ticket = await ticketResponse.json();

      setSelectedTicket(ticket);

      if (notesResponse.ok) {
        const ticketNotes = await notesResponse.json();
        setNotes(ticketNotes);
      } else {
        setNotes([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailsLoading(false);
      setNotesLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets;
  }, [tickets]);

  const handleSearch = (event) => {
    event.preventDefault();

    fetchTickets();
  };

  const handleClearSearch = () => {
    setSearch("");
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleCreateTicket = async (event) => {
    event.preventDefault();

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(`${API_URL}/tickets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTicket),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to create ticket.");
      }

      setNewTicket({
        customerName: "",
        customerEmail: "",
        subject: "",
        description: "",
      });

      setShowCreateModal(false);

      setSuccessMessage(
        `Ticket ${data.ticketId} created successfully.`
      );

      await fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (status) => {
    if (!selectedTicket) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/tickets/${selectedTicket.ticketId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to update ticket."
        );
      }

      setSelectedTicket(data);

      setSuccessMessage(
        "Ticket status updated successfully."
      );

      await fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddNote = async (event) => {
    event.preventDefault();

    if (!selectedTicket || !noteText.trim()) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/tickets/${selectedTicket.ticketId}/notes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            noteText: noteText.trim(),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to add note."
        );
      }

      setNotes((currentNotes) => [
        data,
        ...currentNotes,
      ]);

      setNoteText("");

      setSuccessMessage("Note added successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteTicket = async () => {
    if (!selectedTicket) {
      return;
    }

    try {
      setError("");
      setSuccessMessage("");

      const response = await fetch(
        `${API_URL}/tickets/${selectedTicket.ticketId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to delete ticket."
        );
      }

      setSelectedTicket(null);
      setNotes([]);
      setShowDeleteConfirm(false);

      setSuccessMessage(
        "Ticket deleted successfully."
      );

      await fetchTickets();
    } catch (err) {
      setError(err.message);
    }
  };

  const openTicket = (ticketId) => {
    fetchTicketDetails(ticketId);
  };

  const closeDetails = () => {
    setSelectedTicket(null);
    setNotes([]);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalTickets = tickets.length;

  const openTickets = tickets.filter(
    (ticket) => ticket.status === "OPEN"
  ).length;

  const inProgressTickets = tickets.filter(
    (ticket) => ticket.status === "IN_PROGRESS"
  ).length;

  const closedTickets = tickets.filter(
    (ticket) => ticket.status === "CLOSED"
  ).length;

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <Ticket size={22} />
          </div>

          <div>
            <h1>SupportDesk</h1>
            <span>Customer Support CRM</span>
          </div>
        </div>

        <div className="topbar-actions">
          <div className="api-status">
            <span className="status-dot"></span>
            API Connected
          </div>

          <button
            className="primary-button"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={18} />
            New Ticket
          </button>
        </div>
      </header>

      <main className="main-content">
        <section className="page-heading">
          <div>
            <p className="eyebrow">Support operations</p>

            <h2>Ticket Dashboard</h2>

            <p className="page-description">
              Manage customer requests, track ticket status,
              and keep internal notes in one place.
            </p>
          </div>

          <button
            className="refresh-button"
            onClick={fetchTickets}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </section>

        {successMessage && (
          <div className="alert success-alert">
            <CheckCircle2 size={18} />

            <span>{successMessage}</span>

            <button
              onClick={() => setSuccessMessage("")}
            >
              <X size={16} />
            </button>
          </div>
        )}

        {error && (
          <div className="alert error-alert">
            <AlertCircle size={18} />

            <span>{error}</span>

            <button onClick={() => setError("")}>
              <X size={16} />
            </button>
          </div>
        )}

        <section className="stats-grid">
          <StatCard
            icon={<Activity size={20} />}
            label="Total Tickets"
            value={totalTickets}
            detail="Current results"
          />

          <StatCard
            icon={<AlertCircle size={20} />}
            label="Open"
            value={openTickets}
            detail="Needs attention"
          />

          <StatCard
            icon={<Clock3 size={20} />}
            label="In Progress"
            value={inProgressTickets}
            detail="Being handled"
          />

          <StatCard
            icon={<CheckCircle2 size={20} />}
            label="Closed"
            value={closedTickets}
            detail="Resolved tickets"
          />
        </section>

        <section className="toolbar-card">
          <form
            className="search-box"
            onSubmit={handleSearch}
          >
            <Search size={19} />

            <input
              type="text"
              placeholder="Search tickets, customers, email or subject..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />

            {search && (
              <button
                type="button"
                className="clear-search"
                onClick={handleClearSearch}
              >
                <X size={16} />
              </button>
            )}
          </form>

          <div className="filter-select">
            <select
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              {STATUS_OPTIONS.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <ChevronDown size={16} />
          </div>
        </section>

        <section className="content-card">
          <div className="card-header">
            <div>
              <h3>Tickets</h3>

              <p>
                {filteredTickets.length}{" "}
                {filteredTickets.length === 1
                  ? "ticket"
                  : "tickets"}{" "}
                found
              </p>
            </div>
          </div>

          {loading ? (
            <div className="empty-state">
              <RefreshCw
                className="loading-icon"
                size={26}
              />

              <h4>Loading tickets...</h4>

              <p>
                Fetching the latest support requests.
              </p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <Ticket size={26} />
              </div>

              <h4>No tickets found</h4>

              <p>
                Try changing your search or create a new
                ticket.
              </p>

              <button
                className="primary-button"
                onClick={() =>
                  setShowCreateModal(true)
                }
              >
                <Plus size={17} />
                Create Ticket
              </button>
            </div>
          ) : (
            <div className="ticket-table-wrapper">
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    <th>Customer</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTickets.map((ticket) => (
                    <tr
                      key={ticket.ticketId}
                      onClick={() =>
                        openTicket(ticket.ticketId)
                      }
                    >
                      <td>
                        <span className="ticket-number">
                          {ticket.ticketId}
                        </span>
                      </td>

                      <td>
                        <div className="customer-cell">
                          <div className="avatar">
                            {ticket.customerName
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {ticket.customerName}
                            </strong>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="subject-text">
                          {ticket.subject}
                        </span>
                      </td>

                      <td>
                        <StatusBadge
                          status={ticket.status}
                        />
                      </td>

                      <td>
                        <span className="date-text">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </td>

                      <td>
                        <button
                          className="view-button"
                          onClick={(event) => {
                            event.stopPropagation();
                            openTicket(
                              ticket.ticketId
                            );
                          }}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {selectedTicket && (
        <div
          className="drawer-overlay"
          onClick={closeDetails}
        >
          <aside
            className="ticket-drawer"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="drawer-header">
              <div>
                <span className="drawer-ticket-id">
                  {selectedTicket.ticketId}
                </span>

                <h2>{selectedTicket.subject}</h2>
              </div>

              <button
                className="icon-button"
                onClick={closeDetails}
              >
                <X size={20} />
              </button>
            </div>

            {detailsLoading ? (
              <div className="drawer-loading">
                <RefreshCw
                  className="loading-icon"
                  size={25}
                />

                <p>
                  Loading ticket details...
                </p>
              </div>
            ) : (
              <div className="drawer-body">
                <div className="detail-status-row">
                  <StatusBadge
                    status={selectedTicket.status}
                  />

                  <div className="status-control">
                    <label>Update status</label>

                    <select
                      value={selectedTicket.status}
                      onChange={(event) =>
                        handleStatusChange(
                          event.target.value
                        )
                      }
                    >
                      <option value="OPEN">
                        Open
                      </option>

                      <option value="IN_PROGRESS">
                        In Progress
                      </option>

                      <option value="CLOSED">
                        Closed
                      </option>
                    </select>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Customer</h3>

                  <div className="customer-detail">
                    <div className="large-avatar">
                      {selectedTicket.customerName
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>
                      <strong>
                        {selectedTicket.customerName}
                      </strong>

                      <span>
                        {selectedTicket.customerEmail}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Description</h3>

                  <div className="description-box">
                    {selectedTicket.description}
                  </div>
                </div>

                <div className="detail-meta">
                  <div>
                    <span>Created</span>

                    <strong>
                      {formatDate(
                        selectedTicket.createdAt
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Last updated</span>

                    <strong>
                      {formatDate(
                        selectedTicket.updatedAt
                      )}
                    </strong>
                  </div>
                </div>

                <div className="detail-section notes-section">
                  <div className="section-heading">
                    <div>
                      <h3>Internal Notes</h3>

                      <span>
                        {notes.length} notes
                      </span>
                    </div>

                    <MessageSquare size={19} />
                  </div>

                  <form
                    className="note-form"
                    onSubmit={handleAddNote}
                  >
                    <textarea
                      placeholder="Add an internal note..."
                      value={noteText}
                      onChange={(event) =>
                        setNoteText(
                          event.target.value
                        )
                      }
                      rows="3"
                    />

                    <button
                      className="secondary-button"
                      type="submit"
                      disabled={!noteText.trim()}
                    >
                      Add Note
                    </button>
                  </form>

                  {notesLoading ? (
                    <div className="notes-loading">
                      <RefreshCw
                        className="loading-icon"
                        size={20}
                      />

                      Loading notes...
                    </div>
                  ) : notes.length === 0 ? (
                    <div className="no-notes">
                      <FileText size={21} />

                      <span>
                        No internal notes yet.
                      </span>
                    </div>
                  ) : (
                    <div className="notes-list">
                      {notes.map((note) => (
                        <div
                          className="note-item"
                          key={note.id}
                        >
                          <div className="note-icon">
                            <MessageSquare size={15} />
                          </div>

                          <div className="note-content">
                            <p>{note.noteText}</p>

                            <span>
                              {formatDate(
                                note.createdAt
                              )}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="danger-zone">
                  <div>
                    <strong>
                      Delete this ticket
                    </strong>

                    <span>
                      This action permanently removes
                      the ticket and its notes.
                    </span>
                  </div>

                  <button
                    className="delete-button"
                    onClick={() =>
                      setShowDeleteConfirm(true)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            )}
          </aside>
        </div>
      )}

      {showCreateModal && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowCreateModal(false)
          }
        >
          <div
            className="modal-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <span className="eyebrow">
                  New request
                </span>

                <h2>Create Ticket</h2>
              </div>

              <button
                className="icon-button"
                onClick={() =>
                  setShowCreateModal(false)
                }
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="ticket-form"
              onSubmit={handleCreateTicket}
            >
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="customerName">
                    Customer Name
                  </label>

                  <input
                    id="customerName"
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={newTicket.customerName}
                    onChange={(event) =>
                      setNewTicket({
                        ...newTicket,
                        customerName:
                          event.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">
                    Customer Email
                  </label>

                  <input
                    id="customerEmail"
                    type="email"
                    placeholder="customer@example.com"
                    value={newTicket.customerEmail}
                    onChange={(event) =>
                      setNewTicket({
                        ...newTicket,
                        customerEmail:
                          event.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">
                  Subject
                </label>

                <input
                  id="subject"
                  type="text"
                  placeholder="What is the customer contacting you about?"
                  value={newTicket.subject}
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      subject: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  placeholder="Describe the customer's issue..."
                  rows="5"
                  value={newTicket.description}
                  onChange={(event) =>
                    setNewTicket({
                      ...newTicket,
                      description:
                        event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    setShowCreateModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Plus size={17} />
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && selectedTicket && (
        <div
          className="modal-overlay confirmation-overlay"
          onClick={() =>
            setShowDeleteConfirm(false)
          }
        >
          <div
            className="confirm-card"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="confirm-icon">
              <Trash2 size={22} />
            </div>

            <h2>Delete ticket?</h2>

            <p>
              Are you sure you want to permanently
              delete{" "}
              <strong>
                {selectedTicket.ticketId}
              </strong>
              ? This will also remove all internal
              notes.
            </p>

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={() =>
                  setShowDeleteConfirm(false)
                }
              >
                Cancel
              </button>

              <button
                className="delete-button"
                onClick={handleDeleteTicket}
              >
                <Trash2 size={16} />
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  detail,
}) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-content">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const labels = {
    OPEN: "Open",
    IN_PROGRESS: "In Progress",
    CLOSED: "Closed",
  };

  return (
    <span
      className={`status-badge ${status
        .toLowerCase()
        .replace("_", "-")}`}
    >
      <span className="badge-dot"></span>

      {labels[status] || status}
    </span>
  );
}

export default App;